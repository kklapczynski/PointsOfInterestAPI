const cartesianPlane = require('../cartesianPlane.js');

describe("cartesianPlane", function() {
    it("should return line equation parameter A = 0 for points [2,2] and [5,5]", function() {
        expect(cartesianPlane.lineEquationParamA([2,2],[5,5])).toEqual(1);
    });

    it("should return line equation parameter C = 0 for points [2,2] and [5,5]", function() {
        expect(cartesianPlane.lineEquationParamC([2,2],[5,5])).toEqual(0);
    });

    it("should return distance 1,4142... for point [5,6] from line with parameters A=1, B=-1, C=0", function() {
        expect(parseFloat(cartesianPlane.pointDistanceFromLine(1,-1,0,[5,6]).toFixed(4))).toEqual(0.7071);
    });

    it("should return distance between points [2,2] and [5,5] equal 4.242641", function() {
        expect(parseFloat(cartesianPlane.pointsDistance([2,2],[5,5]).toFixed(6))).toEqual(4.242641);
    });
});