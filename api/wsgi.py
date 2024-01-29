from flask import Flask, redirect, session, make_response, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from authlib.integrations.flask_client import OAuth
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy import UniqueConstraint, select, delete
from dataclasses import dataclass
import json

db = SQLAlchemy()
app = Flask(__name__)

app.debug = False

app.config.from_pyfile('config.cfg', silent=True)
app.secret_key = app.config['SESSION_SECRET_KEY']

app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{app.config['DATABASE_NAME']}'

db.init_app(app)

@dataclass
class User(db.Model):
    __tablename__ = 'user'

    id = db.Column(db.String(35), primary_key=True)
    email = db.Column(db.String(128), unique=False, nullable=False)
    first_name = db.Column(db.String(64), unique=False, nullable=False)
    last_name = db.Column(db.String(64), unique=False, nullable=False)
    work_assignments = db.relationship('WorkAssignment', backref='user', cascade='all, delete, delete-orphan')
    roles = db.relationship('Role', backref='user', cascade='all, delete, delete-orphan')

@dataclass
class Role(db.Model):
    __tablename__ = 'role'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.String(35), db.ForeignKey('user.id'), unique=False, nullable=False)
    role = db.Column(db.String(64), unique=False, nullable=False)
    UniqueConstraint(user_id, role, name='uq_user_role')

@dataclass
class WorkAssignment(db.Model):
    __tablename__ = 'work_assignment'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.String(35), unique=False, nullable=False)
    user_id = db.Column(db.String(35), db.ForeignKey('user.id'), unique=False, nullable=False)
    vehicle_number = db.Column(db.String(3), unique=False, nullable=True)
    work_assignment_type = db.Column(db.String(64), unique=False, nullable=False)
    work_assignment_station = db.Column(db.Integer, unique=False, nullable=False)
    work_assignment_run_group = db.Column(db.String(64), unique=False, nullable=False)
    work_assignment_segment = db.Column(db.String(64), unique=False, nullable=False)
    UniqueConstraint(event_id, user_id, work_assignment_segment, name='uq_workassignment_event_user_segment')

@dataclass
class EventSettings(db.Model):
    __tablename__ = 'event_settings'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.String(35), unique=True, nullable=False)
    stations = db.Column(db.Integer, unique=False, nullable=True)

@dataclass
class PreregistrationAccess(db.Model):
    __tablename__ = 'preregistration_access'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.String(35), unique=False, nullable=False)
    user_id = db.Column(db.String(35), unique=False, nullable=False)
    UniqueConstraint(event_id, user_id, name='uq_preregistration_access_event_user_segment')

def fetch_token():
    token = session.get('token')
    if token is None:
        token = {'oauth_token': None}

    return token

with app.app_context():
    db.create_all()

    oauth = OAuth(app)
    oauth.register('msr', fetch_token=fetch_token)

## Auth
@app.route('/auth/login')
def login():
    res = oauth.msr.authorize_redirect(app.config['CALLBACK_URL'])
    return res.location

@app.route('/auth/callback')
def callback():
    try:
        token = oauth.msr.authorize_access_token()
        session['token'] = token

        res = oauth.msr.get('rest/me.json')
        res.raise_for_status()

        profile = json.loads(res.content).get('response').get('profile')
        stmt = insert(User).values(
            id = profile['id'],
            email = profile['email'],
            first_name = profile['firstName'],
            last_name = profile['lastName']
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=[User.id],
            set_={
                User.email: stmt.excluded.email,
                User.first_name: stmt.excluded.first_name,
                User.last_name: stmt.excluded.last_name
            }
        )
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        app.logger.error(e)
    finally:
        return redirect(app.config['APP_URL'])

@app.route('/auth/logout')
def logout():
    session.pop('token', None)

    return make_response({}, 200)

## API
@app.route('/api/me')
def get_user():
    res = oauth.msr.get('rest/me.json')
    return make_response(res.content, res.status_code)

@app.route('/api/me/events')
def get_user_events():
    res = oauth.msr.get('rest/me/events.json')    
    return make_response(res.content, res.status_code)

@app.route('/api/organization/events')
def get_organization_events():
    start = request.args['start']
    end = request.args['end']

    res = oauth.msr.get(f'rest/calendars/organization/{app.config['MSR_ORGANIZATION_ID']}.json', params={'start': start, 'end': end, 'archive': True})
    return make_response(res.content, res.status_code)

@app.route('/api/events/<event_id>/entrylist')
def get_entrylist(event_id):
    res = oauth.msr.get(f'rest/events/{event_id}/entrylist.json')    
    return make_response(res.content, res.status_code)

@app.route('/api/events/<event_id>/assignments', methods=['GET'])
def get_work_assignments(event_id):
    try:
        q = WorkAssignment.query.join(User, WorkAssignment.user_id == User.id) \
            .filter(WorkAssignment.event_id == event_id) \
            .add_columns(User.id, User.first_name, User.last_name).all()
        assignments = [{
            "id": a[0].id,
            "eventId": a[0].event_id,
            "user": {
                "id": a.id,
                "firstName": a.first_name,
                "lastName": a.last_name
            },
            "vehicleNumber": a[0].vehicle_number,
            "type": a[0].work_assignment_type,
            "station": a[0].work_assignment_station,
            "runGroup": a[0].work_assignment_run_group,
            "segment": a[0].work_assignment_segment
        } for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response({}, 500)

    return jsonify(assignments)

@app.route('/api/events/<event_id>/assignments', methods=['POST'])
def post_work_assignment(event_id):
    try:
        data = json.loads(request.data)
        stmt = insert(WorkAssignment).values(
            event_id = event_id,
            user_id = data.get('user').get('id'),
            vehicle_number = data.get('vehicleNumber'),
            work_assignment_type =  data.get('type'),
            work_assignment_station =  data.get('station'),
            work_assignment_run_group =  data.get('runGroup'),
            work_assignment_segment =  data.get('segment')
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=[WorkAssignment.user_id, WorkAssignment.event_id, WorkAssignment.work_assignment_segment],
            set_={
                WorkAssignment.vehicle_number: stmt.excluded.vehicle_number,
                WorkAssignment.work_assignment_type: stmt.excluded.work_assignment_type,
                WorkAssignment.work_assignment_station: stmt.excluded.work_assignment_station,
                WorkAssignment.work_assignment_run_group: stmt.excluded.work_assignment_run_group
            }
        )
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)

@app.route('/api/events/<event_id>/assignments', methods=['DELETE'])
def delete_work_assignment(event_id):
    try:
        data = json.loads(request.data)
        stmt = delete(WorkAssignment) \
            .where(WorkAssignment.event_id == event_id) \
            .where(WorkAssignment.user_id == data.get('user').get('id')) \
            .where(WorkAssignment.work_assignment_type == data.get('type')) \
            .where(WorkAssignment.work_assignment_station == data.get('station')) \
            .where(WorkAssignment.work_assignment_run_group == data.get('runGroup')) \
            .where(WorkAssignment.work_assignment_segment == data.get('segment'))
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)

@app.route('/api/events/<event_id>/settings')
def get_event_settings(event_id):
    try:
        q1 = EventSettings.query.filter(EventSettings.event_id == event_id).first()
        q2 = PreregistrationAccess.query.join(User, PreregistrationAccess.user_id == User.id) \
             .filter(PreregistrationAccess.event_id == event_id) \
             .add_columns(User.id, User.first_name, User.last_name).all()
        if q1 and q2 is None:
            return make_response({}, 200)
        settings = {
            "id": q1.id,
            "eventId": q1.event_id,
            "stations": q1.stations,
            "preregistrationAccess": [{
                "id": u.id,
                "firstName": u.first_name,
                "lastName": u.last_name
            } for u in q2]
        }
    except Exception as e:
        app.logger.error(e)
        return make_response({}, 500)

    return jsonify(settings)

@app.route('/api/events/<event_id>/settings', methods=['POST'])
def post_event_settings(event_id):
    try:
        data = json.loads(request.data)
        stmt1 = insert(EventSettings).values(
            event_id = event_id,
            stations = data.get('stations')
        )
        stmt1 = stmt1.on_conflict_do_update(
            index_elements=[EventSettings.event_id],
            set_={
                EventSettings.stations: stmt1.excluded.stations
            }
        )
        db.session.execute(stmt1)

        preregistrationAccess = data.get('preregistrationAccess')
        if (preregistrationAccess):
            PreregistrationAccess.query.filter(PreregistrationAccess.event_id == event_id) \
                .filter(PreregistrationAccess.user_id.not_in([u.get('id') for u in preregistrationAccess])).delete()
            
            stmt2 = insert(PreregistrationAccess).values([{
                "event_id": event_id,
                "user_id": u.get('id'),
            } for u in preregistrationAccess])
            stmt2 = stmt2.on_conflict_do_nothing(
                index_elements=[PreregistrationAccess.event_id, PreregistrationAccess.user_id],
            )
            db.session.execute(stmt2)
        else:
            PreregistrationAccess.query.filter(PreregistrationAccess.event_id == event_id).delete()

        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)

@app.route('/api/user/all')
def get_users():
    try:
        q = User.query.all()
        users = [{
            "id": a.id,
            "firstName": a.first_name,
            "lastName": a.last_name,
            "email": a.email
        } for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return jsonify(users)

@app.route('/api/user/<user_id>/roles')
def get_user_roles(user_id):
    try:
        q = Role.query.where(Role.user_id == user_id)
        roles = [a.role for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return jsonify(roles)

@app.route('/api/user/<user_id>/roles', methods=['POST'])
def post_user_role(user_id):
    try:
        data = json.loads(request.data)
        stmt = insert(Role).values(
            user_id = user_id,
            role = data.get('role')
        )
        stmt = stmt.on_conflict_do_nothing(
            index_elements=[Role.user_id, Role.role]
        )
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)

@app.route('/api/user/<user_id>/roles', methods=['DELETE'])
def delete_user_role(user_id):
    try:
        data = json.loads(request.data)
        stmt = delete(Role) \
            .where(Role.user_id == user_id) \
            .where(Role.role == data.get('role'))
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)