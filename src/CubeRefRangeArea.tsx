export default function CubeRefRangeArea() {
  return (
    <>
      <h1>Range and Area</h1>
      <table>
        <thead>
          <tr>
            <th scope="col">Distance</th>
            <th scope="col">Area</th>
            <th scope="col">Description</th>
            <th scope="col">Range</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">Close</th>
            <td>Small</td>
            <td>Anything close enough to touch</td>
            <td>Up to 10 feet (3m)</td>
          </tr>
          <tr>
            <th scope="row">Near</th>
            <td>Medium</td>
            <td>Something you could reach quickly</td>
            <td>10-50 feet (3-15m)</td>
          </tr>
          <tr>
            <th scope="row">Far</th>
            <td>Large</td>
            <td>Something you can see clearly but not reach quickly</td>
            <td>50-100 feet (15-30m)</td>
          </tr>
          <tr>
            <th scope="row">Very Far</th>
            <td>Very large</td>
            <td>Something you can see but not clearly</td>
            <td>100-500 feet (30-150m)</td>
          </tr>
        </tbody>
      </table>
      <p>
        <em>Rules reference: "The Key" p. 72</em>
      </p>
    </>
  );
}
