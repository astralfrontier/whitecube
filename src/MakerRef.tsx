import { map, sum, times } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

interface MakerCosts {
  orbs: number;
  crystalOrbs: number;
  magecoins: number;
  examples?: string;
}

const MATERIALS_COSTS: Partial<MakerCosts>[] = [
  {
    crystalOrbs: 10,
    examples: "iron, common wood, granite, glass",
  },
  {
    crystalOrbs: 25,
    examples: "crystal, fine iron, goblinbone, steel",
  },
  {
    crystalOrbs: 50,
    examples: "gold, silver, human flesh, ancient oak",
  },
  {
    crystalOrbs: 75,
    examples: "emerald, diamond, ice",
  },
  {
    crystalOrbs: 100,
    examples: "silver yak hide, taborwire thread, hastric wood",
  },
  {
    crystalOrbs: 150,
    examples: "lusterstone, ebonwood, frozen curses, desaldium",
  },
  {
    crystalOrbs: 200,
    examples: "demonbone, demonflesh",
  },
  {
    magecoins: 1,
    examples: "talish glass",
  },
  {
    magecoins: 2,
    examples: "sands of time, solidified song",
  },
  {
    magecoins: 5,
    examples: "pure love, godflesh",
  },
];

const INGREDIENTS_COSTS: Partial<MakerCosts>[] = [
  {
    orbs: 10,
    examples: "sugar, salt, spices, honey, caterpillar, mistletoe",
  },
  {
    orbs: 50,
    examples:
      "bat wing, rat tail, newt's eye, elderflower stems, black beetle eye, powdered moonstone, liquid silver, bone dust, nightshade, peacock feather",
  },
  {
    orbs: 100,
    examples:
      "crocodile heart, powdered lilbana leaf, eyelash of an infant, elderbrin tears",
  },
  {
    crystalOrbs: 2,
    examples: "toad hairs, nettle bird feather, mummy dust",
  },
  {
    crystalOrbs: 10,
    examples: "gravel trod upon by a king",
  },
  {
    crystalOrbs: 20,
    examples: "polist petals",
  },
  {
    crystalOrbs: 50,
    examples: "powdered despair, truespider eye",
  },
  {
    magecoins: 1,
    examples: "errix hound blood",
  },
  {
    magecoins: 2,
    examples: "secret name of an angel",
  },
  {
    magecoins: 3,
    examples: "godsblood",
  },
];

const POWER_SOURCES_COSTS: Partial<MakerCosts>[] = [
  {
    examples: "good intentions",
  },
  {
    crystalOrbs: 4,
    examples: "heat from a silent fire, stray idea",
  },
  {
    crystalOrbs: 8,
    examples: "moon fox brain",
  },
  {
    crystalOrbs: 15,
    examples: "qaat leaf solution",
  },
  {
    crystalOrbs: 30,
    examples: "vug essence",
  },
  {
    crystalOrbs: 50,
    examples: "gold trapped in crystal",
  },
  {
    crystalOrbs: 100,
    examples: "demon's heart",
  },
  {
    magecoins: 1,
    examples: "durrantix eye",
  },
  {
    magecoins: 2,
    examples: "vigor shard",
  },
  {
    magecoins: 5,
    examples: "sun essence",
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

function formatCost(costs: MakerCosts): React.ReactNode {
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

  if (costs.examples) {
    return <span data-tooltip={costs.examples}>{s.join(", ")}</span>;
  } else {
    return s.join(", ");
  }
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [makerDegree, setMakerDegree] = useState<number>(
    parseInt(searchParams.get("d") || "1") || 1
  );
  const [itemLevel, setItemLevel] = useState<number>(
    parseInt(searchParams.get("l") || "1") || 1
  );
  const [modifiers, setModifiers] = useState<number>(
    parseInt(searchParams.get("m") || "0") || 0
  );
  const [venture, setVenture] = useState<number>(
    parseInt(searchParams.get("v") || "0") || 0
  );

  const maxItemLevel = useMemo(
    () => [4, 6, 7, 8, 9, 17][makerDegree - 1] || 0,
    [makerDegree]
  );

  const onChangeMakerDegree: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const newMakerDegree = parseInt(e.target.value);
        setMakerDegree(newMakerDegree);
        setSearchParams((params) => {
          params.set("d", `${newMakerDegree}`);
          return params;
        });
      },
      [setSearchParams]
    );
  const onChangeItemLevel: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const newItemLevel = Math.min(parseInt(e.target.value), maxItemLevel);
        setItemLevel(newItemLevel);
        setSearchParams((params) => {
          params.set("l", `${newItemLevel}`);
          return params;
        });
      },
      [maxItemLevel, setSearchParams]
    );
  const onChangeModifiers: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const newModifier = parseInt(e.target.value);
        setModifiers(newModifier);
        setSearchParams((params) => {
          params.set("m", `${newModifier}`);
          return params;
        });
      },
      [setSearchParams]
    );
  const onChangeVenture: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      (e) => {
        const newVenture = parseInt(e.target.value);
        setVenture(newVenture);
        setSearchParams((params) => {
          params.set("v", `${newVenture}`);
          return params;
        });
      },
      [setSearchParams]
    );

  useEffect(() => {
    if (itemLevel > maxItemLevel) {
      setItemLevel(maxItemLevel);
    }
  }, [itemLevel, maxItemLevel]);

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

  const excessVenture = useMemo(
    () => venture - (itemLevel + 1 + modifiers),
    [venture, itemLevel, modifiers]
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
              <small>Max level is {maxItemLevel} for your Degree</small>
            </label>
            <label>
              Modifiers
              <input
                type={"number"}
                name="modifiers"
                value={modifiers}
                onChange={onChangeModifiers}
              />
              <small>
                +1 per -1 day of work; -1/-2 for Minor/Major Side Effects
                {makerDegree == 2 && (
                  <>; +2 to make Ephemera in half the time</>
                )}
              </small>
            </label>
            <label>
              Venture
              <input
                type={"number"}
                name="venture"
                min={0}
                value={venture}
                onChange={onChangeVenture}
              />
              <small>Craft skill; Tool level; Intellect bene</small>
            </label>
          </fieldset>
        </div>
        <div>
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Cost</th>
                <th>Challenge</th>
                <th>Odds</th>
              </tr>
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
                    <td>{Math.max(i + 1 + modifiers - venture, 0)}</td>
                    <td>{odds(i + 1 + modifiers, venture)}</td>
                  </tr>
                ),
                itemLevel
              )}
              <tr>
                <td>Add Power Source</td>
                <td>{formatCost(powerSourceCosts)}</td>
                <td>{Math.max(itemLevel + 1 + modifiers - venture, 0)}</td>
                <td>{odds(itemLevel + 1 + modifiers, venture)}</td>
              </tr>
            </tbody>
          </table>
          <small>
            Note: "Challenge" is the challenge level taking venture into
            account. "Odds" is the chance of success. If this is not 100%, you
            may need Catalysts and Stabilizers to succeed.
          </small>
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
          {excessVenture > 0 && (
            <p>
              You have {excessVenture} venture above and beyond what's needed.
              Consider reducing the time to make the item (which gives a
              modifier of +1 per day saved).
            </p>
          )}
        </div>
      </div>
    </>
  );
}
