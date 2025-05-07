import { useCallback, useEffect, useMemo, useState } from "react";
import { MSREvent } from "../../models/msr-event";
import { useWorkAssignmentsContext } from "../../contexts/work-assignments-context";
import {
  useGetEventResults,
  useSetEventResults,
  useSetEventSettings,
  useUnsetEventResult,
} from "../../hooks/events";
import { useGetUsers } from "../../hooks/users";
import { MSRUser } from "../../models/msr-user";
import { closeDropdownOnClick } from "../../helpers/utils";
import {
  eventHasStarted,
  eventRegistrationHasStarted,
} from "../../helpers/events";

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

  const [results, setResults] = useState<string[]>([]);

  const getEventResults = useGetEventResults(() => {}, props.event);
  const setEventResults = useSetEventResults(() => {}, props.event);
  const unsetEventResults = useUnsetEventResult(() => {}, props.event);

  useEffect(() => {
    if (getEventResults && results.length === 0) {
      setResults(getEventResults);
    }
  }, [getEventResults, results, setResults]);

  const [userInput, setUserInput] = useState<string>("");
  const getUsers = useGetUsers();

  const hasStarted = useMemo(() => eventHasStarted(props.event), [props.event]);
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

  const onChangeAssistants = useCallback(
    (assistants: string) => {
      setSettings({ ...settings, assistants: +assistants });
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

  const assistantsSelector = useMemo(
    () => (
      <select
        className="select select-primary select-md"
        disabled={hasRegistrationStarted}
        value={settings.assistants}
        onChange={(e) => {
          onChangeAssistants(e.target.value);
        }}
      >
        {(() => {
          const options = [];
          for (let i = 1; i <= 2; i++) {
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
    [settings.assistants, onChangeAssistants, hasRegistrationStarted]
  );

  const onChangeResults = useCallback(
    (files: FileList) => {
      let filenames = Array.from(files).map((f) => f.name);

      setResults((prevResults) => {
        const existingFilenames = new Set(prevResults);

        const uniqueNewFilenames = filenames.filter(
          (filename) => !existingFilenames.has(filename)
        );

        return [...prevResults, ...uniqueNewFilenames];
      });
    },
    [setEventResults, setResults]
  );

  const onRemoveResult = useCallback(
    (filename: string) => {
      setResults((prevResults) => prevResults.filter((f) => f !== filename));

      unsetEventResults(filename);
    },
    [setResults, unsetEventResults]
  );

  const uploadPreliminaryResults = useMemo(
    () => (
      <input
        type="file"
        className="file-input file-input-primary"
        multiple
        disabled={!hasStarted}
        onChange={(e) => {
          if (e.target.files) {
            onChangeResults(e.target.files);
            e.target.value = "";
          }
        }}
      />
    ),
    [onChangeResults, hasStarted]
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

  const resultsBadges = useMemo(() => {
    return (
      <div>
        {results.map((result) => (
          <div
            key={result}
            className="badge badge-primary gap-2 p-3 mt-1 mb-1 mr-3"
          >
            <button onClick={() => onRemoveResult(result)}>
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
            {result}
          </div>
        ))}
      </div>
    );
  }, [results, onRemoveResult]);

  const modalActions = useMemo(() => {
    return (
      <div className="modal-action mt-2">
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
        <div className="mb-2 work-assignments-header">
          <div className="font-bold text-lg">Event Settings</div>
          <div className="font-bold text-sm">{props.event.name}</div>
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
              <span className="font-bold label-text">Assistants</span>
            </div>
            {assistantsSelector}
            <div className="label">
              <span className="label-text-alt">
                The number of assistants to display on the work assignment
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
        <div className="divider divider-neutral"></div>
        <label className="form-control w-full">
          <div className="label">
            <span className="font-bold label-text">
              Upload Preliminary Results
            </span>
          </div>
          {uploadPreliminaryResults}
          <div className="label">
            <span className="label-text-alt">
              Upload preliminary results from AXWare.
            </span>
          </div>
        </label>
        <div className="flex flex-row mt-1">{resultsBadges}</div>
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default EventSettingsModal;
