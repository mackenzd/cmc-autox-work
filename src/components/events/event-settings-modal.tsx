import { useCallback, useMemo, useState } from "react";
import { MSREvent } from "../../models/msr-event";
import { useWorkAssignmentsContext } from "../../contexts/work-assignments-context";
import { useSetEventSettings } from "../../hooks/events";
import { useGetUsers } from "../../hooks/users";
import { MSRUser } from "../../models/msr-user";
import { closeDropdownOnClick } from "../../helpers/utils";
import { eventRegistrationHasStarted } from "../../helpers/events";

export interface EventSettingsModalProps {
  event: MSREvent;
  isOpen: boolean;
  onClose: () => void;
}

const EventSettingsModal = (props: EventSettingsModalProps) => {
  const maxStations = 12;

  const { settings, setSettings, initializeSettings, setInitialSettings } =
    useWorkAssignmentsContext();

  const setEventSettings = useSetEventSettings(() => {
    setSettings(settings);
  }, props.event);

  const [userInput, setUserInput] = useState<string>("");
  const getUsers = useGetUsers();

  const hasRegistrationStarted = useMemo(
    () => eventRegistrationHasStarted(props.event),
    [props.event]
  );

  const onChangeStations = useCallback(
    (stations: string) => {
      setSettings({ ...settings, stations: +stations });
    },
    [settings, setSettings]
  );

  const onAddUser = useCallback(
    (user: MSRUser) => {
      closeDropdownOnClick(() => {
        setSettings({
          ...settings,
          preregistrationAccess: [
            ...(settings.preregistrationAccess || []),
            user,
          ],
        });
        setUserInput("");
      });
    },
    [setUserInput, setSettings, settings]
  );

  const onRemoveUser = useCallback(
    (user: MSRUser) => {
      setSettings({
        ...settings,
        preregistrationAccess: settings.preregistrationAccess?.filter((u) => {
          return u.id !== user.id;
        }),
      });
    },
    [setSettings, settings]
  );

  const onSave = useCallback(() => {
    setEventSettings(settings);
    setInitialSettings(settings);
    props.onClose();
    // eslint-disable-next-line
  }, [setEventSettings, settings, setInitialSettings]);

  const onClose = () => {
    initializeSettings();
    props.onClose();
  };

  const stationsSelector = useMemo(
    () => (
      <select
        className="select select-primary select-md"
        disabled={hasRegistrationStarted}
        value={settings.stations}
        onChange={(e) => {
          onChangeStations(e.target.value);
        }}
      >
        {(() => {
          const options = [];
          for (let i = 1; i <= maxStations; i++) {
            options.push(
              <option key={i} value={i}>
                {i}
              </option>
            );
          }
          return options;
        })()}
      </select>
    ),
    [settings.stations, onChangeStations, hasRegistrationStarted]
  );

  const usersOptions = useMemo(() => {
    return (
      <>
        {getUsers
          .filter((user) => {
            return (
              !settings.preregistrationAccess?.some((u) => {
                return u.id === user.id;
              }) &&
              (`${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(userInput.toLowerCase()) ||
                `${user.lastName} ${user.firstName}`
                  .toLowerCase()
                  .includes(userInput.toLowerCase()) ||
                `${user.lastName}, ${user.firstName}`
                  .toLowerCase()
                  .includes(userInput.toLowerCase()))
            );
          })
          .sort((u1, u2) => (u1.lastName > u2.lastName ? 1 : -1))
          .slice(0, 5)
          .map((user, index) => {
            return (
              <li key={index} tabIndex={index + 1}>
                <button
                  onClick={() => closeDropdownOnClick(() => onAddUser(user))}
                >{`${user.lastName}, ${user.firstName}`}</button>
              </li>
            );
          })}
      </>
    );
  }, [getUsers, settings.preregistrationAccess, userInput, onAddUser]);

  const usersInput = useMemo(() => {
    return (
      <div className="dropdown dropdown-bottom dropdown-start">
        <label className="form-control w-full">
          <input
            type="text"
            disabled={hasRegistrationStarted}
            placeholder="Enter member's name..."
            className="input input-primary input-bordered w-full"
            value={userInput}
            onChange={(e) => {
              setUserInput(e.target.value);
            }}
          />
        </label>
        <div className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-52 outline outline-1">
          <ul className="menu menu-compact">{usersOptions}</ul>
        </div>
      </div>
    );
  }, [userInput, usersOptions, hasRegistrationStarted]);

  const usersBadges = useMemo(() => {
    return (
      <div>
        {settings.preregistrationAccess?.map((user) => (
          <div
            key={user.id}
            className="badge badge-primary gap-2 p-3 mt-1 mb-1 mr-3"
          >
            {!hasRegistrationStarted ? (
              <button onClick={() => onRemoveUser(user)}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  className="w-4 h-4 stroke-current"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            ) : (
              <></>
            )}
            {`${user.firstName} ${user.lastName}`}
          </div>
        ))}
      </div>
    );
  }, [settings.preregistrationAccess, onRemoveUser, hasRegistrationStarted]);

  const modalActions = useMemo(() => {
    return (
      <div className="modal-action">
        {hasRegistrationStarted ? (
          <div className="label-text self-center">
            Event settings are disabled once registration has started.
          </div>
        ) : (
          <></>
        )}
        <button
          className="btn btn-outline btn-sm self-center"
          disabled={hasRegistrationStarted}
          onClick={onSave}
        >
          Save
        </button>
      </div>
    );
  }, [hasRegistrationStarted, onSave]);

  return props.isOpen ? (
    <dialog className="modal" open={props.isOpen}>
      <div className="modal-box border border-current overflow-y-visible">
        <button
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="gap-4 work-assignments-header">
          <h3 className="font-bold text-lg">
            Event Settings - {props.event.name}
          </h3>
        </div>
        <div>
          <label className="form-control w-full">
            <div className="label">
              <span className="font-bold label-text">Cone Stations</span>
            </div>
            {stationsSelector}
            <div className="label">
              <span className="label-text-alt">
                The number of cone stations to display on the work assignment
                request form.
              </span>
            </div>
          </label>
          <label className="form-control w-full">
            <div className="label">
              <span className="font-bold label-text">
                Pre-registration Access
              </span>
            </div>
            {usersInput}
            <div className="label">
              <span className="label-text-alt">
                Members who should be allowed pre-registration access to this
                event.
              </span>
            </div>
          </label>
          <div className="flex flex-row mt-1">{usersBadges}</div>
        </div>
        {modalActions}
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default EventSettingsModal;
