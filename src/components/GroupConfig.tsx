import { groupSizes } from "../util/common";

interface GroupConfigProps {
  onIncrease: () => unknown;
  onDecrease: () => unknown;
  groupSize: Number;
}

function GroupConfig({ onIncrease, onDecrease, groupSize }: GroupConfigProps) {
  return (
    <div className="group-config">
      <button onClick={onDecrease} disabled={groupSize === groupSizes[0]}>
        -
      </button>
      <div className="group-config-label">
        Group:{" "}
        <span className="group-config-size">
          {groupSize.toFixed(2).toLocaleString()}
        </span>
      </div>
      <button
        onClick={onIncrease}
        disabled={groupSize === groupSizes[groupSizes.length - 1]}
      >
        +
      </button>
    </div>
  );
}

export default GroupConfig;
