var DatahubClient = {
    getMetrics: function(credentials, monitored_object, interval_secs) {
	return new Promise((resolve, reject) => {
	    var xhr = new XMLHttpRequest();
	    xhr.open("GET", '/api/performance/123', true);

	    //Send the proper header information along with the request
	    xhr.setRequestHeader("Content-Type", "application/json");
	    xhr.setRequestHeader("Cache-Control", "no-cache");

	    xhr.onreadystatechange = function() {//Call a function when the state changes.
		if(this.readyState == XMLHttpRequest.DONE) {
		    if(this.status == 200) {
			console.log(xhr.response)
			resolve(JSON.parse(xhr.response))
		    } else {
			reject('Response code was '+this.status)
		    }
		}
	    }
	    
	    xhr.send()
	})    
    }

}

if(typeof module !== 'undefined' && typeof module.exports !== 'undefined') 
    module.exports = DatahubClient
else
    window.DatahubClient = DatahubClient
    
