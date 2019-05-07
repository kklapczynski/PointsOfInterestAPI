var exports = module.exports = {};
// notes
// point P(Xp, Yp) distance from line: d = |A*Xp + B*Yp +C| / sqrt(A^2 + b^2) where A, B and C are parameters of line equation
        // line equation: A*x + B*y + C = 0 including given points A(Xa, Ya), B(Xb, Yb):
        // (y-Ya)(Xb-Xa)-(Yb-Ya)(x-Xa)=0
        // so line equation parameters:
        // A = (Ya-Yb)/(Xa-Xb); B=-1; C=(Ya-((Ya-Yb)/(Xa-Xb))*Xa)

// functions to calculate line equation parameters for line running through given two points
// A = (Ya-Yb)/(Xa-Xb)
exports.lineEquationParamA = function(startCoordinatesArray, endCoordinatesArray) {
    return (startCoordinatesArray[1]-endCoordinatesArray[1])/(startCoordinatesArray[0]-endCoordinatesArray[0]);
}
// B=-1
exports.lineEquationParamB = function() {
    return -1;
}
// C=(Ya-((Ya-Yb)/(Xa-Xb))*Xa)
exports.lineEquationParamC = function(startCoordinatesArray, endCoordinatesArray) {
    return (startCoordinatesArray[1]-((startCoordinatesArray[1]-endCoordinatesArray[1])/(startCoordinatesArray[0]-endCoordinatesArray[0]))*startCoordinatesArray[0])
}

// distance between points
// when using geographical coordinates in decimal degrees, result is as well in this unit
exports.pointsDistance = function(point1CoordinatesArray, point2CoordinatesArray) {
    return Math.sqrt(
        Math.pow(point2CoordinatesArray[0]-point1CoordinatesArray[0],2) +
        Math.pow(point2CoordinatesArray[1]-point1CoordinatesArray[1],2)
    );
}
// distance of point from line
exports.pointDistanceFromLine = function(lineEquationParamA, lineEquationParamB, lineEquationParamC, pointCoordinates) {
    return Math.abs(lineEquationParamA*pointCoordinates[0] + lineEquationParamB*pointCoordinates[1] + lineEquationParamC)/Math.sqrt(lineEquationParamA*lineEquationParamA + lineEquationParamB*lineEquationParamB);
}