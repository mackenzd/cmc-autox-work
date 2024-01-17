import { useCallback } from "react";
import { MSREvent } from "../../models/msr-event";
import { useWorkAssignmentsContext } from "../work-assignments/work-assignments-context";
import { useSetEventSettings } from "../../hooks/events";
import { EventSettings } from "../../models/event-settings";

export interface EventSettingsModalProps {
  event: MSREvent;
  isOpen: boolean;
  onClose: () => void;
}

const EventSettingsModal = (props: EventSettingsModalProps) => {
  const maxStations = 12;
  const { settings, setSettings } = useWorkAssignmentsContext();

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
    props.onClose();
  }, [setEventSettings, settings]);

  const onClose = () => {
    setSettings(settings);
    props.onClose();
  };

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
            <div className="label">
              <span className="label-text-alt">
                The number of cone stations to display on the work assignment
                request form.
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
