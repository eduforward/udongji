// Firestore 규칙 게시: node publish-rules.js sa.json firestore.rules (higgsfield sandbox에서 실행)
const fs=require('fs'),crypto=require('crypto'),https=require('https');
const sa=JSON.parse(fs.readFileSync(process.argv[2]||'sa.json'));const rules=fs.readFileSync(process.argv[3]||'firestore.rules','utf8');
const b64=o=>Buffer.from(JSON.stringify(o)).toString('base64url');const now=Math.floor(Date.now()/1000);
const jwtU=b64({alg:'RS256',typ:'JWT'})+'.'+b64({iss:sa.client_email,scope:'https://www.googleapis.com/auth/firebase https://www.googleapis.com/auth/cloud-platform',aud:sa.token_uri,iat:now,exp:now+3600});
const sig=crypto.sign('RSA-SHA256',Buffer.from(jwtU),sa.private_key).toString('base64url');
const req=(m,u,body,tok,ct)=>new Promise((res,rej)=>{const url=new URL(u);const r=https.request({method:m,hostname:url.hostname,path:url.pathname+url.search,headers:Object.assign({'Content-Type':ct||'application/json'},tok?{Authorization:'Bearer '+tok}:{})},x=>{let d='';x.on('data',c=>d+=c);x.on('end',()=>res({s:x.statusCode,d}))});r.on('error',rej);r.end(body)});
(async()=>{
 const t=await req('POST',sa.token_uri,'grant_type=urn%3Aietf%3Aparams%3Aoauth%3Agrant-type%3Ajwt-bearer&assertion='+jwtU+'.'+sig,null,'application/x-www-form-urlencoded');const tok=JSON.parse(t.d).access_token; if(!tok) throw new Error('token '+t.d);
 const p='projects/'+sa.project_id;
 const rs=await req('POST','https://firebaserules.googleapis.com/v1/'+p+'/rulesets',JSON.stringify({source:{files:[{name:'firestore.rules',content:rules}]}}),tok); if(rs.s!==200) throw new Error('ruleset '+rs.d); const name=JSON.parse(rs.d).name;
 const rel=await req('PATCH','https://firebaserules.googleapis.com/v1/'+p+'/releases/cloud.firestore',JSON.stringify({release:{name:p+'/releases/cloud.firestore',rulesetName:name}}),tok);
 console.log('release',rel.s, rel.s===200?'OK':rel.d);
})().catch(e=>{console.error(e.message);process.exit(1)});
