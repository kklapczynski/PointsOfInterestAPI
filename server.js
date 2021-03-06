const express = require('express');
const graphqlHTTP = require('express-graphql');
const {buildSchema} = require('graphql');
const cartesianPlane = require('./cartesianPlane.js');

// define GraphQL schema
const schema = buildSchema(`
    type Query {
        poi(position: [Float]!): PointOfInterest
        pois(startPosition: [Float], endPosition: [Float]): [PointOfInterest]
    }

    type PointOfInterest {
        pointOfInterestID: Int
        name: String
        position: [Float]
        description: String
        imgPath: String
        openingHours: String
        visitDurationEstimate: Int
        costPerPerson: Int
        facilities: String
        avarageRating: Int
        indieRating: Int
        indiePromote: Boolean
    }
`);

// dummy data for testing
const poisData = [
    {
        pointOfInterestID: 1,
        name: 'Torre de Belém',
        position: [38.691552,-9.215938],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 2,
        name: 'Castelo do Óbidos',
        position: [39.358205, -9.158147],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 3,
        name: 'Castelo de Marvão',
        position: [39.396668, -7.379707],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 4,
        name: 'Piscinas Municipais Descobertas De Mação',
        position: [39.556886, -7.993621],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 5,
        name: 'Praia Fluvial do Alamal',
        position: [39.488292, -7.967471],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 6,
        name: 'Serra da Estrela',
        position: [40.321489, -7.612331],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 7,
        name: 'Castelo de Guimarães',
        position: [41.447909, -8.290256],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 8,
        name: 'Mosteiro da Batalha',
        position: [39.658925, -8.825701],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 9,
        name: 'Forte da Lagarteira',
        position: [41.815524, -8.867628],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    },
    {
        pointOfInterestID: 10,
        name: 'Parque de campismo de Rio de Onor',
        position: [41.938113, -6.617089],
        description: '',
        imgPath: '',
        openingHours: '',
        visitDurationEstimate: null,
        costPerPerson: null,
        facilities: '',
        avarageRating: null,
        indieRating: null,
        indiePromote: true
    }
]
const testTrips = [
    {   description: 'Mação_Alamal',
        expectedPOIsIDs: [4,5],
        startPoint: [39.564456, -7.999034],
        endPoint: [39.479926, -7.962854]
    },
    {
        description: 'Mação_Alamal_null_trip',
        expectedPOIsIDs: [],
        startPoint: [39.531144, -8.016516],
        endPoint: [39.532148, -7.962236]
    },
    {
        description: 'Mação_Alamal_null_trip_long - extended to catch POIs within proportionally enlarged range',
        expectedPOIsIDs: [4,5],
        startPoint: [39.526962,-8.102650],
        endPoint: [39.528796, -7.848990]
    },
    {
        description: 'Norte de Portugal - to catch 3 north POIs: Forte da Lagarteira, Parque de campismo de Rio de Onor and Castelo de Guimarães',
        expectedPOIsIDs: [7,9,10],
        startPoint: [41.607319, -8.808319],
        endPoint: [41.865909, -6.516725]
    }
];

// get POIs between start and end points of a trip
// Notes:
        // distances are NOT accurate, cause will be used only to limit number of POIs to ones between start and end of trip
        // therefore simplifications are in place:
        // geographic coordinates are used as in plane cartesian coordinate system
        // if distances are calculated from degrees to km, ratio is based on equator lenght: 40,075 km / 360 =  111 km per 1 deg

// max allowed distance from straight line between start and end point of trip as a proportion of trip length
// 1/4 has been set as default
const tripRange = 0.25;

const getPOIs = function(args) {
    if(args.startPosition && args.endPosition) {
        // two points are passed to query: filter POIs along line between them
        const startPosition = args.startPosition;
        const endPosition = args.endPosition;
        const lineEquationParamA = cartesianPlane.lineEquationParamA(startPosition, endPosition);
        const lineEquationParamB = cartesianPlane.lineEquationParamB();
        const lineEquationParamC = cartesianPlane.lineEquationParamC(startPosition, endPosition);
        const tripDistance = cartesianPlane.pointsDistance(startPosition, endPosition);

        // filter POIs within given distance from straight line between start and end points of trip
        // unit of pointDistanceFromLine and tripDistance is decimal degree and doesn't need to be
        // calculated to [km] as it's used only to filter POIs by checking their distance from trip line
        // as a proportion of its length
        return poisData.filter(poi => {
            return cartesianPlane.pointDistanceFromLine(lineEquationParamA, lineEquationParamB, lineEquationParamC, poi.position) <= tripDistance*tripRange;
        })
    } else if (args.startPosition) {
        // one point is passed: filter closest POI to it
        const startPosition = args.startPosition;
        // due to schema expected: [PointOfInnterest] need to return array with one POI
        return Array.of(poisData.reduce((closest, poi) => {
            return cartesianPlane.pointsDistance(startPosition, closest.position) < cartesianPlane.pointsDistance(startPosition, poi.position) ? closest : poi;
        }));
    } else {
        // no argument is passed: get all points
        return poisData;
    }
};

const getClosestPOI = function(args) {
    if (args.position) {
        // one point is passed: filter closest POI to it
        const position = args.position;
        return poisData.reduce((closest, poi) => {
            return cartesianPlane.pointsDistance(position, closest.position) < cartesianPlane.pointsDistance(position, poi.position) ? closest : poi;
        });
    }
};

const root = {
    poi: getClosestPOI,
    pois: getPOIs
};

// create an express server with graphQL endpoint
// create instance of express server
const app = express();

// attach express-graphql middleware to the endpoint: '/graphql'
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}));

app.listen(4000, () => console.log('Express GraphQL server running!'));


