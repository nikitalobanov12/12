const http = require('node:http');

const cToF = data => `<h1>${data}C is ${(data * 9) / 5 + 32}F</h1`;
const fToC = data => `<h1>${data}F is ${((data - 32) * 5) / 9}C`;

const parseData = data => {
	const inputs = data.split('&').map(input => input.split('=')); //first split them into the input forms, then split each value into its key value pair
	const parsed = {};

	for (const [key, value] of inputs) parsed[key] = value;
	// console.log(parsed);

	return parsed;
};

const webServer = http.createServer((req, res) => {
	if (req.method === 'GET') {
		res.setHeader('Content-Type', 'text/html');
		res.end(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Temperature Converter</title>
    </head>
    <body>
      <h1>Temperature Converter</h1>
      <form method="post">
       <label>
          <input type="number" name="temperature" placeholder="Enter a temperature value here" required />
        </label>
        <br><br>
        <label>
          <input type="radio" name="conversion" value="c-to-f" required />
          Celsius to Fahrenheit
        </label>
        <br>
        <label>
          <input type="radio" name="conversion" value="f-to-c" />
          Fahrenheit to Celsius
        </label>
        <br><br>
        <button>Convert</button>
      </form>
    </body>
    </html>
    `);
	} else {
		let totalData = '';
		req.on('data', chunk => (totalData += chunk.toString()));
		req.on('end', () => {
			const parsedData = parseData(totalData);
			res.setHeader('Content-Type', 'text/html');

			res.end(
				parsedData.conversion == 'c-to-f'
					? cToF(parsedData.temperature)
					: fToC(parsedData.temperature)
			);
		});
	}
});

webServer.listen(8081, () => {
	console.log('Web Server is now running!');
});
