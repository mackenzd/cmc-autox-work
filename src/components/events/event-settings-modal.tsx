import { useCallback, useMemo } from "react";
import { MSREvent } from "../../models/msr-event";
import { useWorkAssignmentsContext } from "../../contexts/work-assignments-context";
import { useSetEventSettings } from "../../hooks/events";

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
