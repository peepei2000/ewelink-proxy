import { readFileSync } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  // Serve the callback HTML with the query params intact
  const html = `<!DOCTYPE html>
<html>
<head><title>eWeLink Auth</title></head>
<body>
<script>
  var params = new URLSearchParams(window.location.search);
  var code = params.get('code');
  var region = params.get('region');
  
  if (code && window.opener) {
    window.opener.postMessage({ type: 'ewelink_auth', code: code, region: region }, '*');
    document.body.innerHTML = '<h2 style="font-family:sans-serif;text-align:center;margin-top:40px">✅ Autenticado! Puedes cerrar esta ventana.</h2>';
    setTimeout(function() { window.close(); }, 2000);
  } else if (code) {
    document.body.innerHTML = '<h2 style="font-family:sans-serif;text-align:center;margin-top:40px">✅ Código: ' + code + '</h2>';
  } else {
    document.body.innerHTML = '<h2 style="font-family:sans-serif;text-align:center;margin-top:40px;color:red">❌ Error</h2>';
  }
</script>
</body>
</html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}
