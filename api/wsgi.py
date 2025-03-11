from collections import defaultdict
from datetime import timedelta
from flask import Flask, current_app, redirect, session, make_response, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, current_user, login_required, login_user, logout_user
from authlib.integrations.flask_client import OAuth
from sqlalchemy.dialects.sqlite import insert
from sqlalchemy import UniqueConstraint, delete
from dataclasses import dataclass
from functools import wraps
import json

db = SQLAlchemy()
app = Flask(__name__)

app.config.from_envvar('CMC_CONFIG')
app.secret_key = app.config.get('FLASK_SECRET_KEY')
app.permanent_session_lifetime = timedelta(weeks=4)

app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{app.config['DATABASE_NAME']}"

login_manager = LoginManager(app)

db.init_app(app)
login_manager.init_app(app)

@dataclass
class User(db.Model, UserMixin):
    __tablename__ = 'user'

    id = db.Column(db.String(35), primary_key=True)
    member_id = db.Column(db.String(35), unique=True, nullable=True)
    email = db.Column(db.String(128), unique=False, nullable=True)
    first_name = db.Column(db.String(64), unique=False, nullable=False)
    last_name = db.Column(db.String(64), unique=False, nullable=False)
    avatar = db.Column(db.String(128), unique=False, nullable=True)
    work_assignments = db.relationship('WorkAssignment', backref='user', cascade='all, delete, delete-orphan')
    roles = db.relationship('Role', backref='user', cascade='all, delete, delete-orphan')

    def has_role(self, role: str):
        roles = [r.role for r in self.roles]
        return role in roles

@dataclass
class Role(db.Model, UserMixin):
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
    type = db.Column(db.String(64), unique=False, nullable=False)
    station = db.Column(db.Integer, unique=False, nullable=False)
    run_group = db.Column(db.String(64), unique=False, nullable=False)
    segment = db.Column(db.String(64), unique=False, nullable=False)
    UniqueConstraint(event_id, user_id, segment, name='uq_workassignment_event_user_segment')

@dataclass
class EventSettings(db.Model):
    __tablename__ = 'event_settings'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.String(35), unique=True, nullable=False)
    stations = db.Column(db.Integer, unique=False, nullable=True)
    assistants = db.Column(db.Integer, unique=False, nullable=True)

@dataclass
class PreregistrationAccess(db.Model):
    __tablename__ = 'preregistration_access'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    event_id = db.Column(db.String(35), unique=False, nullable=False)
    user_id = db.Column(db.String(35), unique=False, nullable=False)
    UniqueConstraint(event_id, user_id, name='uq_preregistration_access_event_user_segment')

@login_manager.user_loader
def load_user(user_id):
    user = User.query.get(user_id)
    return user

def admin_required(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        if current_user.is_authenticated and current_user.has_role('Admin'):
            return f(*args, **kwargs)
        else:
            return current_app.login_manager.unauthorized()

    return wrap

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
    res = oauth.msr.authorize_redirect(app.config['CMC_CALLBACK_URL'])
    return res.location

@app.route('/auth/callback')
def callback():
    try:
        token = oauth.msr.authorize_access_token()
        session['token'] = token

        res = oauth.msr.get('rest/me.json')
        res.raise_for_status()

        profile = json.loads(res.content).get('response').get('profile')
        member_id = next((org.get("memberId") for org in profile.get('organizations') if org.get('id') == app.config['MSR_ORGANIZATION_ID']), None)

        user = User(id = profile.get('id'),
                    member_id = member_id,
                    email = profile.get('email'),
                    first_name = profile.get('firstName'),
                    last_name = profile.get('lastName'),
                    avatar = profile.get('avatar'))

        stmt = insert(User).values(
            id = profile.get('id'),
            member_id = member_id,
            email = profile.get('email'),
            first_name = profile.get('firstName'),
            last_name = profile.get('lastName'),
            avatar = profile.get('avatar')
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=[User.id],
            set_={
                User.member_id: stmt.excluded.member_id,
                User.email: stmt.excluded.email,
                User.first_name: stmt.excluded.first_name,
                User.last_name: stmt.excluded.last_name,
                User.avatar:stmt.excluded.avatar
            }
        )
        db.session.execute(stmt)
        db.session.commit()

        session.permanent = True
        login_user(user)
    except Exception as e:
        app.logger.error(e)
    finally:
        return redirect(app.config['CMC_APP_URL'])

@app.route('/auth/logout')
@login_required
def logout():
    logout_user()
    session.pop('token', None)

    return make_response({}, 200)

## API
@app.route('/api/me')
@login_required
def get_me():
    res = oauth.msr.get('rest/me.json')
    return make_response(res.content, res.status_code)

@app.route('/api/me/roles')
@login_required
def get_my_roles():
    try:
        q = Role.query.where(Role.user_id == current_user.id)
        roles = [a.role for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return jsonify(roles)

@app.route('/api/me/preregistration')
@login_required
def get_my_preregistration():
    try:
        q = PreregistrationAccess.query.where(PreregistrationAccess.user_id == current_user.id).all()
        preregistration = [a.event_id for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return jsonify(preregistration)

@app.route('/api/me/events')
@login_required
def get_my_events():
    res = oauth.msr.get('rest/me/events.json')    
    return make_response(res.content, res.status_code)

@app.route('/api/organization/events')
@login_required
def get_organization_events():
    start = request.args.get('start')
    end = request.args.get('end')

    res = oauth.msr.get(f"rest/calendars/organization/{app.config['MSR_ORGANIZATION_ID']}.json", params={'start': start, 'end': end, 'archive': True})
    return make_response(res.content, res.status_code)

@app.route('/api/events/<event_id>/entrylist')
@login_required
def get_entrylist(event_id):
    res = oauth.msr.get(f"rest/events/{event_id}/entrylist.json")    
    return make_response(res.content, res.status_code)

@app.route('/api/events/<event_id>/assignments', methods=['GET'])
@login_required
def get_work_assignments(event_id):
    try:
        q = WorkAssignment.query.join(User, WorkAssignment.user_id == User.id) \
            .where(WorkAssignment.event_id == event_id) \
            .add_columns(User.id, User.first_name, User.last_name).all()
        assignments = [{
            'id': a[0].id,
            'eventId': a[0].event_id,
            'user': {
                'id': a.id,
                'firstName': a.first_name,
                'lastName': a.last_name
            },
            'vehicleNumber': a[0].vehicle_number,
            'type': a[0].type,
            'station': a[0].station,
            'runGroup': a[0].run_group,
            'segment': a[0].segment
        } for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response({}, 500)

    return jsonify(assignments)

@app.route('/api/events/<event_id>/assignments', methods=['POST'])
@login_required
def post_work_assignment(event_id):
    try:
        data = json.loads(request.data)
        if current_user.id != data.get('user').get('id') and not current_user.has_role('Admin'):
            return current_app.login_manager.unauthorized()

        q = WorkAssignment.query.where(WorkAssignment.event_id == event_id) \
            .where(WorkAssignment.type == data.get('type')) \
            .where(WorkAssignment.station == data.get('station')) \
            .where(WorkAssignment.run_group == data.get('runGroup')) \
            .where(WorkAssignment.segment == data.get('segment')).first()
        if q:
            return make_response(json.dumps({'error': 'This work assignment has been requested by another member.'}), 400)

        stmt = insert(WorkAssignment).values(
            event_id = event_id,
            user_id = data.get('user').get('id'),
            vehicle_number = data.get('vehicleNumber'),
            type =  data.get('type'),
            station =  data.get('station'),
            run_group =  data.get('runGroup'),
            segment =  data.get('segment')
        )
        stmt = stmt.on_conflict_do_update(
            index_elements=[WorkAssignment.user_id, WorkAssignment.event_id, WorkAssignment.segment],
            set_={
                WorkAssignment.vehicle_number: stmt.excluded.vehicle_number,
                WorkAssignment.type: stmt.excluded.type,
                WorkAssignment.station: stmt.excluded.station,
                WorkAssignment.run_group: stmt.excluded.run_group
            }
        )
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)

@app.route('/api/events/<event_id>/assignments', methods=['DELETE'])
@login_required
def delete_work_assignment(event_id):
    try:
        data = json.loads(request.data)
        if current_user.id != data.get('user').get('id') and not current_user.has_role('Admin'):
            return current_app.login_manager.unauthorized()

        stmt = delete(WorkAssignment) \
            .where(WorkAssignment.event_id == event_id) \
            .where(WorkAssignment.user_id == data.get('user').get('id')) \
            .where(WorkAssignment.type == data.get('type')) \
            .where(WorkAssignment.station == data.get('station')) \
            .where(WorkAssignment.run_group == data.get('runGroup')) \
            .where(WorkAssignment.segment == data.get('segment'))
        db.session.execute(stmt)
        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)

@app.route('/api/events/<event_id>/settings')
@login_required
def get_event_settings(event_id):
    try:
        q1 = EventSettings.query.where(EventSettings.event_id == event_id).first()
        q2 = PreregistrationAccess.query.join(User, PreregistrationAccess.user_id == User.id) \
             .where(PreregistrationAccess.event_id == event_id) \
             .add_columns(User.id, User.first_name, User.last_name).all()
        if q1 is None:
            return make_response({}, 200)
        settings = {
            'id': q1.id,
            'eventId': q1.event_id,
            'stations': q1.stations,
            'assistants': q1.assistants,
            'preregistrationAccess': [{
                'id': u.id,
                'firstName': u.first_name,
                'lastName': u.last_name
            } for u in q2]
        }
    except Exception as e:
        app.logger.error(e)
        return make_response({}, 500)

    return jsonify(settings)

@app.route('/api/events/<event_id>/settings', methods=['POST'])
@admin_required
def post_event_settings(event_id):
    try:
        data = json.loads(request.data)
        stmt1 = insert(EventSettings).values(
            event_id = event_id,
            stations = data.get('stations'),
            assistants = data.get('assistants')
        )
        stmt1 = stmt1.on_conflict_do_update(
            index_elements=[EventSettings.event_id],
            set_={
                EventSettings.stations: stmt1.excluded.stations,
                EventSettings.assistants: stmt1.excluded.assistants
            }
        )
        db.session.execute(stmt1)

        preregistrationAccess = data.get('preregistrationAccess')
        if (preregistrationAccess):
            PreregistrationAccess.query.where(PreregistrationAccess.event_id == event_id) \
                .where(PreregistrationAccess.user_id.not_in([u.get('id') for u in preregistrationAccess])).delete()
            
            stmt2 = insert(PreregistrationAccess).values([{
                'event_id': event_id,
                'user_id': u.get('id'),
            } for u in preregistrationAccess])
            stmt2 = stmt2.on_conflict_do_nothing(
                index_elements=[PreregistrationAccess.event_id, PreregistrationAccess.user_id],
            )
            db.session.execute(stmt2)
        else:
            PreregistrationAccess.query.where(PreregistrationAccess.event_id == event_id).delete()

        db.session.commit()
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return make_response({}, 200)

@app.route('/api/user/all')
@admin_required
def get_users():
    try:
        q = User.query.all()
        users = [{
            'id': a.id,
            'memberId': a.member_id,
            'firstName': a.first_name,
            'lastName': a.last_name,
            'email': a.email,
            'roles': [b.role for b in a.roles]
        } for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return jsonify(users)

@app.route('/api/user/<user_id>/roles')
@admin_required
def get_user_roles(user_id):
    try:
        q = Role.query.where(Role.user_id == user_id)
        roles = [a.role for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return jsonify(roles)

@app.route('/api/user/<user_id>/roles', methods=['POST'])
@admin_required
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
@admin_required
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

@app.route('/api/user/<user_id>/preregistration')
@admin_required
def get_user_preregistration(user_id):
    try:
        q = PreregistrationAccess.query.where(PreregistrationAccess.user_id == user_id).all()
        preregistration = [a.event_id for a in q]
    except Exception as e:
        app.logger.error(e)
        return make_response(json.dumps({'error': e}), 500)

    return jsonify(preregistration)

## Templates
@app.route('/templates/events/<event_id>/work_assignments.html')
@admin_required
def work_assignments_html(event_id):
    title = request.args.get('title')
    segment = request.args.get('segment')
    run_group = request.args.get('runGroup')

    q = WorkAssignment.query.join(User, WorkAssignment.user_id == User.id) \
            .where(WorkAssignment.event_id == event_id) \
            .add_columns(User.id, User.first_name, User.last_name)
    
    if segment:
        q = q.where(WorkAssignment.segment == segment)
    if run_group:
        q = q.where(WorkAssignment.run_group == run_group)

    assignments = [{
            'id': a[0].id,
            'eventId': a[0].event_id,
            'user': {
                'id': a.id,
                'firstName': a.first_name,
                'lastName': a.last_name
            },
            'vehicleNumber': a[0].vehicle_number,
            'type': a[0].type,
            'station': a[0].station,
            'runGroup': a[0].run_group,
            'segment': a[0].segment
        } for a in q.all()]
    
    q2 = EventSettings.query.where(EventSettings.event_id == event_id).first()
    assistants = q2.assistants if q2 != None else 1

    return render_template('work_assignments.html',
                           title=title,
                           segment=segment,
                           run_group=run_group,
                           assistants=assistants,
                           assignments=assignments_to_dict(assignments))

@app.route('/templates/events/<event_id>/registrations.html')
@login_required
@admin_required
def registrations_html(event_id):
    title = request.args.get('title')
    segment = request.args.get('segment')

    q = WorkAssignment.query.join(User, WorkAssignment.user_id == User.id) \
            .where(WorkAssignment.event_id == event_id) \
            .add_columns(User.id, User.first_name, User.last_name)
    
    if segment:
        q = q.where(WorkAssignment.segment == segment)

    assigned_users = [
        {
            'firstName': a.first_name,
            'lastName': a.last_name,
            'vehicleNumber': a[0].vehicle_number,
            'runGroup': a[0].run_group,
            'type': ''.join(filter(lambda x: not x.isdigit(), a[0].type)).strip(),
            'station': a[0].station
        }
     for a in q.all()]        

    assigned_users_by_run_group = defaultdict(lambda: {'users': [], 'count': 0})
    for user in sorted(assigned_users, key=lambda x: x['lastName']):
        assigned_users_by_run_group[user['runGroup']]['users'].append(user)
        assigned_users_by_run_group[user['runGroup']]['count'] += 1

    res = oauth.msr.get(f"rest/events/{event_id}/entrylist.json")    
    entries = json.loads(res.content).get('response').get('assignments')

    unassigned_users = defaultdict(lambda: {'users': [], 'count': 0})
    added_users = set()
    for entry in sorted(entries, key=lambda x: x.get('lastName')):
        user = {
            'firstName': entry.get('firstName'),
            'lastName': entry.get('lastName'),
            'vehicleNumber': entry.get('vehicleNumber')
        }
        if (segment is not None) and (entry.get('segment') == segment) \
            and (user['firstName'], user['lastName']) not in added_users \
            and not any(u['firstName'] == user['firstName'] \
                        and u['lastName'] == user['lastName'] \
                        for u in assigned_users):
            unassigned_users['users']['users'].append(user)
            unassigned_users['users']['count'] += 1
            added_users.add((user['firstName'], user['lastName']))

    return render_template('registrations.html',
                           title=title,
                           segment=segment,
                           assigned_users_by_run_group=assigned_users_by_run_group,
                           unassigned_users=unassigned_users)

## Helpers
def assignments_to_dict(assignments):
    output = {}

    for assignment in assignments:
        user = assignment.get('user')
        name = f"{user.get('firstName')} {user.get('lastName')}"
        vehicle_number = assignment.get('vehicleNumber') or ''
        work_assignment_station = assignment.get('station')
        work_assignment_type = assignment.get('type')

        if work_assignment_station:
            key = f"station{work_assignment_station}_{work_assignment_type.lower().replace(' ', '')}"
        else:
            key = f"{work_assignment_type.lower().replace(' ', '')}"
        output[key] = [name, vehicle_number]

    return output