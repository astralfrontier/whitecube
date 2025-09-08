import { map, sum, times } from "ramda";
import { useCallback, useMemo, useState } from "react";

interface MakerCosts {
  orbs: number;
  crystalOrbs: number;
  magecoins: number;
}

const MATERIALS_COSTS: Partial<MakerCosts>[] = [
  {
    crystalOrbs: 10,
  },
  {
    crystalOrbs: 25,
  },
  {
    crystalOrbs: 50,
  },
  {
    crystalOrbs: 75,
  },
  {
    crystalOrbs: 100,
  },
  {
    crystalOrbs: 150,
  },
  {
    crystalOrbs: 200,
  },
  {
    magecoins: 1,
  },
  {
    magecoins: 2,
  },
  {
    magecoins: 5,
  },
];

const INGREDIENTS_COSTS: Partial<MakerCosts>[] = [
  {
    orbs: 10,
  },
  {
    orbs: 50,
  },
  {
    orbs: 100,
  },
  {
    crystalOrbs: 2,
  },
  {
    crystalOrbs: 10,
  },
  {
    crystalOrbs: 20,
  },
  {
    crystalOrbs: 50,
  },
  {
    magecoins: 1,
  },
  {
    magecoins: 2,
  },
  {
    magecoins: 3,
  },
];

const POWER_SOURCES_COSTS: Partial<MakerCosts>[] = [
  {},
  {
    crystalOrbs: 4,
  },
  {
    crystalOrbs: 8,
  },
  {
    crystalOrbs: 15,
  },
  {
    crystalOrbs: 30,
  },
  {
    crystalOrbs: 50,
  },
  {
    crystalOrbs: 100,
  },
  {
    magecoins: 1,
  },
  {
    magecoins: 2,
  },
  {
    magecoins: 5,
  },
];

function materialCostByLevel(level: number, makerDegree: number): MakerCosts {
  let effectiveLevel = level - 1;
  if (makerDegree >= 3) {
    effectiveLevel = effectiveLevel - 1;
  }
  if (makerDegree >= 5) {
    effectiveLevel = effectiveLevel - 1;
  }
  if (makerDegree == 6) {
    effectiveLevel = effectiveLevel - 1;
  }
  return {
    orbs: 0,
    crystalOrbs: 0,
    magecoins: 0,
    ...MATERIALS_COSTS[effectiveLevel],
  };
}

function ingredientCostByLevel(level: number): MakerCosts {
  return {
    orbs: 0,
    crystalOrbs: 0,
    magecoins: 0,
    ...INGREDIENTS_COSTS[level - 1],
  };
}

function powerSourceCostByLevel(level: number): MakerCosts {
  return {
    orbs: 0,
    crystalOrbs: 0,
    magecoins: 0,
    ...POWER_SOURCES_COSTS[level - 1],
  };
}

function amount(amount: number, label: string): string {
  return `${amount} ${label}${amount > 1 ? "s" : ""}`;
}

function formatCost(costs: MakerCosts): string {
  const s = [];
  if (costs.orbs > 0) {
    s.push(amount(costs.orbs, "orb"));
  }
  if (costs.crystalOrbs > 0) {
    s.push(amount(costs.crystalOrbs, "crystal orb"));
  }
  if (costs.magecoins > 0) {
    s.push(amount(costs.magecoins, "magecoin"));
  }
  return s.join(", ");
}

function odds(dl: number, venture: number): string {
  const remainder = dl - venture;
  return remainder > 0 ? `${(10 - remainder) * 10}%` : "100%";
}

function sumCosts(costs: MakerCosts[]): MakerCosts {
  return {
    orbs: sum(map((cost) => cost.orbs, costs)),
    crystalOrbs: sum(map((cost) => cost.crystalOrbs, costs)),
    magecoins: sum(map((cost) => cost.magecoins, costs)),
  };
}

export default function MakerRef() {
  const [makerDegree, setMakerDegree] = useState<number>(1);
  const [itemLevel, setItemLevel] = useState<number>(1);
  const [modifiers, setModifiers] = useState<number>(0);
  const [venture, setVenture] = useState<number>(0);

  const maxItemLevel = useMemo(
    () => [4, 6, 7, 8, 9, 17][makerDegree - 1] || 0,
    [makerDegree]
  );

  const onChangeMakerDegree: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => setMakerDegree(parseInt(e.target.value)), []);
  const onChangeItemLevel: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => setItemLevel(Math.min(parseInt(e.target.value), maxItemLevel)),
      [maxItemLevel]
    );
  const onChangeModifiers: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => setModifiers(parseInt(e.target.value)), []);
  const onChangeVenture: React.ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => setVenture(parseInt(e.target.value)), []);

  const materialCost = useMemo(
    () => materialCostByLevel(itemLevel, makerDegree),
    [itemLevel, makerDegree]
  );

  const ingredientCosts = useMemo(
    () => times((level) => ingredientCostByLevel(level + 1), itemLevel),
    [itemLevel]
  );

  const powerSourceCosts = useMemo(
    () => powerSourceCostByLevel(itemLevel),
    [itemLevel]
  );

  const totalCosts = useMemo(
    () => sumCosts([materialCost, ...ingredientCosts, powerSourceCosts]),
    [materialCost, ingredientCosts, powerSourceCosts]
  );

  return (
    <>
      <h1>Maker's Matrix</h1>
      <div className="grid">
        <div>
          <fieldset>
            <label>
              Maker Degree
              <input
                type={"number"}
                name="makerDegree"
                min={1}
                max={6}
                value={makerDegree}
                onChange={onChangeMakerDegree}
              />
            </label>
            <label>
              Item Level (including Depletion)
              <input
                type={"number"}
                name="itemLevel"
                min={1}
                max={10}
                value={itemLevel}
                onChange={onChangeItemLevel}
              />
            </label>
            <label>
              Modifiers
              <input
                type={"number"}
                name="modifiers"
                value={modifiers}
                onChange={onChangeModifiers}
              />
            </label>
            <label>
              Venture
              <input
                type={"number"}
                name="venture"
                value={venture}
                onChange={onChangeVenture}
              />
            </label>
          </fieldset>
        </div>
        <div>
          <table>
            <thead>
              <th>Step</th>
              <th>Cost</th>
              <th>Check</th>
              <th>Odds</th>
            </thead>
            <tbody>
              <tr>
                <td>Add Material</td>
                <td>{formatCost(materialCost)}</td>
                <td>-</td>
                <td>100%</td>
              </tr>
              {times(
                (i: number) => (
                  <tr key={`itemLevel${i + 1}`}>
                    <td>Add Level {i + 1} Ingredient</td>
                    <td>{formatCost(ingredientCosts[i])}</td>
                    <td>DL {i + 1 + modifiers}</td>
                    <td>{odds(i + 1 + modifiers, venture)}</td>
                  </tr>
                ),
                itemLevel
              )}
              <tr>
                <td>Add Power Source</td>
                <td>{formatCost(powerSourceCosts)}</td>
                <td>DL {itemLevel + 1 + modifiers}</td>
                <td>{odds(itemLevel + 1 + modifiers, venture)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="grid">
        <div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Level Modifier</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Ephemera (one use)</td>
                <td>-1</td>
              </tr>
              <tr>
                <td>Object of power, depletion: 0-4+</td>
                <td>0</td>
              </tr>
              <tr>
                <td>Object of power, depletion 0-2</td>
                <td>+1</td>
              </tr>
              <tr>
                <td>Object of power, depletion 0-1</td>
                <td>+2</td>
              </tr>
              <tr>
                <td>Object of power, depletion 0</td>
                <td>+3</td>
              </tr>
              <tr>
                <td>Object of power, no depletion, constant</td>
                <td>+4</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          {}
          <p>
            <strong>Sorcery investment:</strong> {itemLevel}
          </p>
          <p>
            <strong>Total Costs:</strong> {formatCost(totalCosts)}
          </p>
          <p>
            <strong>Total Time:</strong> {itemLevel * 2} days
            {makerDegree == 2 && (
              <> (Half time for Ephemera with a higher modifier)</>
            )}
            {makerDegree > 2 && <> (Half time for Ephemera)</>}
          </p>
          <p>
            Modifiers:
            <ul>
              <li>+1 per -1 day of work</li>
              {makerDegree == 2 && (
                <li>+2 to make Ephemera in half the time</li>
              )}
            </ul>
          </p>
        </div>
      </div>
    </>
  );
}
