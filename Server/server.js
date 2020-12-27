const http = require('http');
const fs = require('fs');

const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    response.setHeader("Access-Control-Allow-Methods", "POST, GET, DELETE, OPTIONS");
    response.setHeader("Allow", "POST, GET, DELETE, OPTIONS");

    var headers = JSON.parse(JSON.stringify(request.headers))

    if (request.url === '/' && request.method === 'GET'){
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      
        let rawdata = fs.readFileSync('emails.json');
        let emails = JSON.parse(rawdata);
        response.write(JSON.stringify(emails));
        response.end();

    } else if (request.url.startsWith("/user=") && request.method === 'GET'){
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        let rawdata = fs.readFileSync('emails.json');
        let emails = JSON.parse(rawdata);
        let username = request.url.split('=')[1];
        let returnemail = [];
        emails.map((email, index) => {
            if (email.remetente === username || email.destinatario === username){
                returnemail.push(email);
            }
        });
        response.write(JSON.stringify(returnemail));
        response.end();

    } else if (request.url.startsWith('/email/id=') && request.method === 'GET'){
        let rawdata = fs.readFileSync('emails.json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        let emails = JSON.parse(rawdata);
        let idreturn = request.url.split('=')[1];
        emails = emails.filter((email) => {
                return email.id == idreturn;   
        });
        response.write(JSON.stringify(emails));
        response.end();

    } else if (request.url === '/create' && request.method === 'POST'){
        let rawdata = fs.readFileSync('emails.json');
        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        let emails = JSON.parse(rawdata);
        let body = '';
        request.on('data', content => {
            body += content.toString();
        });
        request.on('end', () => {
            form = JSON.parse(body);
            form2 = JSON.parse(body);

            form.id = Math.round(Math.random()*100000);
            form2.id = Math.round(Math.random()*100000);

            form.isremetente = true;
            form2.isremetente = false;

            emails.push(form)
            emails.push(form2)
            fs.writeFileSync('emails.json', JSON.stringify(emails, null, 2));
            
        });
        response.write("Email enviado com sucesso!");
        response.end();

    } else if (request.url.startsWith('/delete/id=') && request.method === 'DELETE'){
        let rawdata = fs.readFileSync('emails.json');
        let emails = JSON.parse(rawdata);
        let idremove = request.url.split('=')[1];
        emails = emails.filter((email) => {
                return email.id != idremove;   
        });
        fs.writeFileSync('emails.json', JSON.stringify(emails, null, 2));
        response.write("Email removido com sucesso!");
        response.end();

    } else if (request.method === 'OPTIONS'){
        response.end();
    }
});

server.listen(8080, "localhost");
console.log("Listening on port 8080");