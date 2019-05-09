## How to run this project
1. You need to have **Node.js** and **npm** installed on your machine.

2. After downloading project, install required npm packages by running **npm install** command in terminal in its folder, where package.json file is.

3. **npm run start** to start server locally

4. Dummy data for tests is provided in server.js file in poisData variable.

5. Open GraphiQL for API tests in your browser: **http://localhost:4000/graphql**

6. In top left window paste in example query for points of interest that are in range of trip defined by passed in start and end points coordinates:

   ```
   query getPOIs($startPosition: [Float], $endPosition: [Float]) {
        pois(startPosition: $startPosition, endPosition: $endPosition) {
            pointOfInterestID
            name
            position
        }
    }
    ```
8. Below in bottom left pass in arguments: start and end points coordinates of your trip for the above query:
```
    {
    "startPosition": [
        39.526962,
        -8.10265
    ],
    "endPosition": [
        39.528796,
        -7.84899
    ]
    }
```

9. In server.js in testTrips variable are simple scenarios for tests.

10. You can see list of scenarios' locations in GoogleMaps: https://goo.gl/maps/yLQ84Y4TiR9QwanWA

11. See https://graphql.org/learn/ for more info about querying in GraphQL.

12. Query examples with arguments including getClosestPOI:
```
query getPOIs($startPosition: [Float], $endPosition: [Float]) {
  pois(startPosition: $startPosition, endPosition: $endPosition) {
    pointOfInterestID
    name
    position
  }
}

query getClosestPOI($position: [Float]!) {
  poi(position: $position) {
    name
    position
  }
}
```
```
{
  "position": [
    38.565325, -8.466434
  ],
  "startPosition": [41.607319, -8.808319],
  "endPosition": [41.865909, -6.516725]
}
```