import { useCallback, useMemo, useState } from "react";
import { MSREvent } from "../../models/msr-event";
import { useWorkAssignmentsContext } from "../../contexts/work-assignments-context";
import { useSetEventSettings } from "../../hooks/events";
import { useGetUsers } from "../../hooks/users";
import { MSRUser } from "../../models/msr-user";

export interface EventSettingsModalProps {
  event: MSREvent;
  isOpen: boolean;
  onClose: () => void;
}

const EventSettingsModal = (props: EventSettingsModalProps) => {
  const maxStations = 12;
  const { settings, setSettings, initializeSettings, setInitialSettings } =
    useWorkAssignmentsContext();

  const onChangeStations = useCallback(
    (stations: string) => {
      setSettings({ ...settings, stations: +stations });
    },
    [settings, setSettings]
  );

  const setEventSettings = useSetEventSettings(() => {
    setSettings(settings);
  }, props.event);

  const onSave = useCallback(() => {
    setEventSettings(settings);
    setInitialSettings(settings);
    props.onClose();
  }, [setEventSettings, settings, setInitialSettings]);

  const onClose = () => {
    initializeSettings();
    props.onClose();
  };

  const stationsInput = useMemo(
    () => (
      <select
        className="select select-primary select-xs max-w-xs"
        value={settings?.stations}
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
    [settings?.stations, onChangeStations]
  );

  const [value, setValue] = useState<string>("");
  const [users, setUsers] = useState<MSRUser[]>([]);
  const getUsers = useGetUsers();

  const handleClick = (user: MSRUser) => {
    const elem = document.activeElement;
    if (elem) {
      (elem as HTMLElement).blur();
    }

    setUsers((prevUsers) => [...prevUsers, user]);
    setValue("");
    // TODO: Set settings context
  };

  const options = useMemo(() => {
    return (
      <>
        {getUsers
          .filter((user) => {
            return (
              !users.includes(user) &&
              `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(value.toLowerCase())
            );
          })
          .map((user, index) => {
            const userFullName = `${user.firstName} ${user.lastName}`;
            return (
              <li key={index} tabIndex={index + 1}>
                <button onClick={() => handleClick(user)}>
                  {userFullName}
                </button>
              </li>
            );
          })}
      </>
    );
  }, [users, getUsers, value]);

  const whitelistedUsersInput = useMemo(() => {
    return (
      <div className="dropdown dropdown-bottom dropdown-start">
        <label className="form-control w-full">
          <input
            type="text"
            placeholder="Enter member's name..."
            className="input input-bordered w-full"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
        </label>
        <div className="dropdown-content z-[1] shadow bg-base-100 rounded-box w-52">
          <ul className="menu menu-compact">{options}</ul>
        </div>
      </div>
    );
  }, [value, options]);

  // TODO: Remove user from settings on X
  const whitelistedUsersBadges = useMemo(() => {
    return users.map((user) => (
      <div
        key={user.id}
        className="badge badge-primary gap-2 p-3 mt-1 mb-1 mr-3"
      >
        <button onClick={() => {}}>
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
        {user.firstName} {user.lastName}
      </div>
    ));
  }, [users]);

  return props.isOpen ? (
    <dialog className="modal" open={props.isOpen}>
      <div className="modal-box border border-current">
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
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="font-bold label-text">Cone Stations</span>
            </div>
            {stationsInput}
            <div className="label">
              <span className="label-text-alt">
                The number of cone stations to display on the work assignment
                request form.
              </span>
            </div>
          </label>
          <label className="form-control w-full max-w-xs">
            <div className="label">
              <span className="font-bold label-text">Whitelisted Members</span>
            </div>
            {whitelistedUsersInput}
            <div className="flex flex-row mt-1">{whitelistedUsersBadges}</div>
            <div className="label">
              <span className="label-text-alt">
                Members who should be granted pre-registration access to this
                event.
              </span>
            </div>
          </label>
        </div>
        <div className="modal-action">
          <button className="btn btn-outline btn-sm" onClick={onSave}>
            Save
          </button>
        </div>
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default EventSettingsModal;
