import { ErrorMessage, Field, Formik } from "formik";
import React from "react";

interface DepletionEffect {
  effectName: string;
  effectCharacter: string;
  depletionRange: string;
  interval: string;
}

export default function CubeDepletionTracker() {
  const [depletionEffects, setDepletionEFfects] = React.useState<
    DepletionEffect[]
  >([]);
  const [modalIsOpen, setModalIsOpen] = React.useState<boolean>(false);

  const showModalAction = React.useCallback(
    () => setModalIsOpen(true),
    [setModalIsOpen]
  );
  const cancelModalAction = React.useCallback(
    () => setModalIsOpen(false),
    [setModalIsOpen]
  );
  const removeEffectAction = React.useCallback(
    (idx: number) => () => {
      const newDepletionEffects = [...depletionEffects];
      newDepletionEffects.splice(idx, 1);
      setDepletionEFfects(newDepletionEffects);
    },
    [depletionEffects, setDepletionEFfects]
  );

  return (
    <>
      <h1>Depletion Tracker</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Character</th>
            <th scope="col">Range</th>
            <th scope="col">Interval</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {depletionEffects.map((effect, idx) => (
            <tr key={effect.effectName}>
              <th scope="row">{effect.effectName}</th>
              <td>{effect.effectCharacter}</td>
              <td>{effect.depletionRange}</td>
              <td>{effect.interval}</td>
              <td>
                <button onClick={removeEffectAction(idx)}>Delete</button>
              </td>
            </tr>
          ))}
          {depletionEffects.length > 0 || (
            <tr>
              <td colSpan={5}>
                <em>No depletion effects are active</em>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={showModalAction}>Add</button>
      <p>
        <em>Rules reference: "The Key" p. 72</em>
      </p>
      {modalIsOpen && (
        <dialog open>
          <Formik
            initialValues={{
              effectName: "",
              effectCharacter: "",
              depletionRange: "",
              interval: "",
            }}
            validate={(values) => {
              const errors: Record<string, string> = {};
              if (!values.effectName) {
                errors.effectName = "Effect name is required";
              }
              return errors;
            }}
            onSubmit={(values) => {
              setDepletionEFfects([
                ...depletionEffects,
                {
                  effectName: values.effectName,
                  effectCharacter: values.effectCharacter,
                  depletionRange: values.depletionRange,
                  interval: values.interval,
                },
              ]);
              setModalIsOpen(false);
            }}
          >
            {({ handleSubmit, submitForm, isSubmitting, isValid }) => (
              <article>
                <h2>Add Depletion Effect</h2>
                <form onSubmit={handleSubmit}>
                  <fieldset>
                    <label>
                      Effect Name
                      <Field
                        name="effectName"
                        placeholder="Effect name, e.g. 'Flight'"
                      />
                      <small>
                        <ErrorMessage name="effectName" />
                      </small>
                    </label>
                    <label>
                      Character
                      <Field
                        name="effectCharacter"
                        placeholder="Character who owns the effect, e.g. 'Vislae #2'"
                      />
                      <small>
                        <ErrorMessage name="effectCharacter" />
                      </small>
                    </label>
                    <label>
                      Depletion
                      <Field
                        name="depletionRange"
                        placeholder="Depletion range, e.g. 0-4"
                      />
                      <small>
                        <ErrorMessage name="depletionRange" />
                      </small>
                    </label>
                    <label>
                      Check Interval
                      <Field
                        name="interval"
                        placeholder="Check interval, e.g. 'check every hour'"
                      />
                      <small>
                        <ErrorMessage name="interval" />
                      </small>
                    </label>
                  </fieldset>
                </form>
                <footer>
                  <button className="secondary" onClick={cancelModalAction}>
                    Cancel
                  </button>
                  <button
                    disabled={isSubmitting || !isValid}
                    onClick={() => submitForm()}
                  >
                    Add
                  </button>
                </footer>
              </article>
            )}
          </Formik>
        </dialog>
      )}
    </>
  );
}
