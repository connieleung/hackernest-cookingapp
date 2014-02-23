( function( window ) {
    var inputs = {},
        training = {},
	    cost;

    // There are more optimal ways to run this algorithm. This is the just the simplest [this is o(nxm)! ew!].
    // Please research and update for performance.
    var DTWDistance = function(input, t, amt){
        var DTW = [], // size = n x m
            i,j, //counters
            n = input.length,
            m = t.length,
            infinity = 99999; // pretty much infinity...

        // set top row of first column of matrix as infinity
        for(i=0; i<n;i++){
            DTW[i] = []; //make this a matrix
            DTW[i][0] = infinity;
        }
        for(i=1;i<m;i++){
            DTW[0][i] = infinity;
        }

        DTW[0][0] = 0;

        // calculate distance, save in matrix
        for(i=1;i<n;i++){
            for(j=1;j<m;j++){
                cost = Math.abs((input[i] - t[j])/amt);
                DTW[i][j] = cost + Math.min(DTW[i-1][j], DTW[i][j-1], DTW[i-1][j-1]);
            }
        }

        // distance between the two sets
        return DTW[n-1][m-1];
    };

    // add new timepoint - expecting JSON data containing ax, ay, az, gx, gy, gz
    var addInput = function( data, motion ) {

        training = {};

        Object.keys( motion.inputs ).forEach( function( option ) {
            data[option] = 0;
            var type = option.substr(option.length - 1).toLowerCase();
            $.each(motion.axes, function(index, axis){
                data[option] += data[type + axis];
            });
	        motion.inputs[ option ].push( data[ option ] );
            if ( motion.inputs[ option ].length > 100 ) { // save the last 100 time points for each input array
                motion.inputs[ option ].shift();
            }
        } );

	    var score = getScore(motion);

        return score;
    };

    // returns the DTW score of all 6 arrays added    
    var getScore = function(motion){
        var total = 0,
            ret = {};
        Object.keys( motion.inputs ).forEach( function( option ) {
            if ( typeof motion.inputs[option] != 'undefined' ) {
                if (typeof motion[option] == 'undefined' || motion[option].length == 0) {
                    motion[option] = [];
                    // grab the amount off one of the axes, they should all be equal
                    var amount = motion.ax.length;
                    for (var i = 0; i < amount; i++) {
                        var t = 0;
                        $.each(motion.axes, function(index, axis){
                            t += motion['a' + axis][i];
                        });
                        motion[option].push(t);
                    }
                }
                ret[ option ] = DTWDistance( motion.inputs[ option ], motion[ option ], option.match( /g/i ) ? 360 * motion.axes.length : 16 * motion.axes.length );
//                console.log(motion.axes.length);
//                console.log(option);
//                console.log(ret[option]);
                total += ret[ option ];
            }
        } );

        ret.total = total;
        //counting total predictions below threshold
		return ret;
    };


    // make available to window
    window.DTW = addInput;
} )( this );