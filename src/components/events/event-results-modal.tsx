import { useState, useEffect, useMemo, useCallback } from "react";
import { eventHasStarted } from "../../helpers/events";
import {
  useGetEventResult,
  useGetEventResults,
  useSetEventResults,
  useUnsetEventResult,
} from "../../hooks/events";
import { MSREvent } from "../../models/msr-event";
import { useAuthorizationContext } from "../../contexts/authorization-context";

export interface EventResultsModalProps {
  event: MSREvent;
  isOpen: boolean;
  onClose: () => void;
}

const EventResultsModal = (props: EventResultsModalProps) => {
  const { isAdmin } = useAuthorizationContext();

  const [results, setResults] = useState<string[]>([]);

  const getEventResults = useGetEventResults(() => {}, props.event);
  const setEventResults = useSetEventResults(() => {}, props.event);
  const unsetEventResults = useUnsetEventResult(() => {}, props.event);
  const openResults = useGetEventResult(props.event);

  useEffect(() => {
    if (getEventResults) {
      setResults(getEventResults);
    }
  }, [getEventResults, setResults]);

  const hasStarted = useMemo(() => eventHasStarted(props.event), [props.event]);

  const onClose = () => {
    props.onClose();
  };

  const onChangeResults = useCallback(
    (files: FileList) => {
      setEventResults(files);

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
      unsetEventResults(filename);

      setResults((prevResults) => prevResults.filter((f) => f !== filename));
    },
    [unsetEventResults, setResults]
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

  const preliminaryResults = useMemo(
    () => (
      <div>
        <div className="mt-2 mb-2">
          {results.length > 0 ? (
            <>These results are preliminary.</>
          ) : (
            <>No results to display.</>
          )}
        </div>
        {results.map((result) => (
          <div
            key={result}
            className="badge badge-primary gap-2 p-3 mt-1 mb-1 mr-3"
          >
            {isAdmin ? (
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
            ) : (
              <></>
            )}
            <button onClick={() => openResults(result)}>
              {result.replace(/\.[^/.]+$/, "").replace(/_/g, " ")}
            </button>
          </div>
        ))}
      </div>
    ),
    [results, openResults]
  );

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
          <div className="font-bold text-lg">Event Results</div>
          <div className="font-bold text-sm">{props.event.name}</div>
        </div>
        {preliminaryResults}
        {isAdmin ? (
          <>
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
          </>
        ) : (
          <></>
        )}
      </div>
    </dialog>
  ) : (
    <></>
  );
};

export default EventResultsModal;
