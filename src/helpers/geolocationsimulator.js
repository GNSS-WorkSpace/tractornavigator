var KM_IN_DEGREE = 110.562,
    SECONDS_IN_HOUR = 3600,
    UPDATE_INTERVAL = 1000;

export default function Geosimulation(params) {
    var self = {};
    //private vars
    var _watchTimer = null,
        _coords = params.coords,
        _speed = (params.speed || 40) / SECONDS_IN_HOUR, // km/second (defaults to 40kmh or 25mph)
        _current = {
            coords: {
                latitude: 0,
                longitude: 0,
                accuracy: 1,
                altitude: null,
                altitudeAccuracy: null,
                heading: null,
                speed: null
            },
            timestamp: 1
        },
        _rate = { latitude: 0, longitude: 0 },
        _index = -1,
        _pauseTimeout,
        _numSteps,
        _currentStep;

    //public functions            
    self.start = function () {
        nextCoord();
    };

    /**
     * Since not all browsers implement this we have our own utility that will
     * convert from radians into degrees
     *
     * @param rad - The radians to be converted into degrees
     * @return degrees
     */
    function _toDeg(rad) {
        return rad * 180 / Math.PI;
    }

    /**
     * Calculate the bearing between two positions as a value from 0-360
     *
     * @param lat1 - The latitude of the first position
     * @param lng1 - The longitude of the first position
     * @param lat2 - The latitude of the second position
     * @param lng2 - The longitude of the second position
     *
     * @return int - The bearing between 0 and 360
     */
     function bearing(lat1,lng1,lat2,lng2) {
        var dLon = (lng2-lng1);
        var y = Math.sin(dLon) * Math.cos(lat2);
        var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);
        var brng = _toDeg(Math.atan2(y, x));
        return 360 - ((brng + 360) % 360);
    }

    //private functions

    //advance to next coordinate in array
    function nextCoord() {
        _index++;
        //check if route completed
        if (_index < _coords.length - 1) {
            var coord = _coords[_index];

            //set current coordinate, to make sure it makes the jump
            _current.coords.latitude = coord.latitude;
            _current.coords.longitude = coord.longitude;
            _current.coords.heading = coord.heading;

            //set rate of change
            //distance between points with direction for lat and lon (km)
            var deltaLat = (_coords[_index + 1].latitude - coord.latitude) * KM_IN_DEGREE,
                deltaLon = (_coords[_index + 1].longitude - coord.longitude) * KM_IN_DEGREE;

            //as the crow flies distance (km)
            var deltaDist = Math.sqrt((deltaLat * deltaLat) + (deltaLon * deltaLon));

            //total time between points at desired speed (sec)
            var deltaSeconds = Math.floor(deltaDist / _speed);

            //rate of change for each update (1 sec) in lat/lon
            _rate.latitude = deltaLat / deltaSeconds / KM_IN_DEGREE;
            _rate.longitude = deltaLon / deltaSeconds / KM_IN_DEGREE;

            //total steps aka number of seconds
            _numSteps = deltaSeconds;
            _currentStep = 0;

            //check for pause request
            if (coord.pause) {
                console.log('(stops to smell the roses* for', Math.floor(coord.pause / 1000), 'seconds)');
                _pauseTimeout = setTimeout(step, coord.pause);
            } else {
                //prpceed at regular interval
                setTimeout(step, UPDATE_INTERVAL);
            }
        } else {
            //path is complete
            alert('you have arrived!');
        }
    }

    //advance to next update along path between points
    function step() {
        _currentStep++;
        if (_currentStep < _numSteps) {
            var _previousLat = _current.coords.latitude;
            var _previousLng = _current.coords.longitude;
            _current.coords.latitude += _rate.latitude;
            _current.coords.longitude += _rate.longitude;
            _current.coords.heading = bearing(
                _previousLat,
                _previousLng,
                _current.coords.latitude,
                _current.coords.longitude
            )
            setTimeout(step, UPDATE_INTERVAL);
        } else {
            nextCoord();
        }
    }

    //override native geolocation
    navigator.geolocation.getCurrentPosition = function (cb, error, options) {
        cb(_current);
    };

    navigator.geolocation.watchPosition = function (cb, error, options) {
        var sendPos = function () {
            cb(_current);
            _watchTimer = setTimeout(sendPos, 200);
        };
        sendPos();
    };

    navigator.geolocation.clearWatch = function () {
        clearTimeout(_watchTimer);
    };

    return self;
};

//utils
//add convert to radian method for numbers
if (typeof (Number.prototype.toRad) === "undefined") {
    Number.prototype.toRad = function () {
        return this * Math.PI / 180;
    }
}