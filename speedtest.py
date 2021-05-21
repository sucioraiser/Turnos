import os
import subprocess
import time
import json
from flask import Flask , jsonify
app = Flask(__name__)
@app.route('/velo')
def test():
        print ("ENTREEEEEE ")
        args = ['./speedtest', '-a', '-f', 'json', '--accept-license', '--accept-gdpr']

        if os.environ.get('SERVER_ID') != None:
            args.append('-s')
            args.append(os.environ.get('SERVER_ID'))

        p = subprocess.Popen(args , shell=False, stdout=subprocess.PIPE)
        response = p.communicate()
        result = json.loads(response[0])
        subprocess.call("speedtest --progress=yes", shell=True)
        print ("TODO EL RESULTADO ")
        print ("result = " + str(result))
        print ("FIN TODO EL RESULTADO ")
        ##result = test()
        json_body = [
        {  
            "eventType":"Velocidades",
            "measurement": "download",
            "time": str(result['timestamp']),
            "timeseries": {
               "value": int(str(result['download']['bandwidth'])),
                "up": int(result['upload']['bandwidth']),
                "latency": float(result['ping']['latency']),
                "jitter": float(result['ping']['jitter']),
                "interface": str(result['interface']['name']),
                "server": str(result['server']['host']),
                "ISP": str(result['isp'])
                
            }
        }
    ]
        return jsonify(result)
       ## return app.response_class(json_body, content_type='application/json')
        ##return result

if __name__ == "__main__":
 app.run(host='0.0.0.0',
            debug=True,
            port=8080)



    
   ## subprocess.call("curl -i -X POST https://insights-collector.newrelic.com/v1/accounts/3047454/events   -H Content-Type: application/json -H x-insert-key: 'NRII-ZdDBGVlvBnD0C3Qbt-J0fKjiHcRHkSnw'  -d '+json_body+'", shell=True)
       

  
   
   