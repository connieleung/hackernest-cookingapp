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
    var addInput = function( data, sumA, sumG ) {

	    if ( sumA.length > 0 ) {
		    data.sumA = data.ax + data.ay + data.az;
		    inputs.sumA = [];
		    training.sumA = sumA;
	    }

	    if ( sumG.length > 0 ) {
		    data.sumG = data.gx + data.gy + data.gz;
		    inputs.sumG = [];
		    training.sumG = sumG;
	    }

        Object.keys( inputs ).forEach( function( option ) {
	        inputs[ option ].push( data[ option ] );
            if ( inputs[ option ].length > 100 ) { // save the last 100 time points for each input array
                inputs[ option ].shift();
            }
        } );

	    var score = getScore();

        return score;
    };

    // returns the DTW score of all 6 arrays added    
    var getScore = function(){
        var total = 0,
            ret = {};

        Object.keys( inputs ).forEach( function( option ) {
            ret[ option ] = DTWDistance( inputs[ option ], training[ option ], option.match( /g/i ) ? 360 * 3 : 16 * 3 );
            total += ret[ option ];
        });

        ret.total = total;
        //counting total predictions below threshold
		return ret;
    };


    // make available to window
    window.DTW = addInput;
} )( this );