import request from "supertest";
import app from "server/src";

const bearerToken: string = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1wbG95ZWVJZCI6LTEsInVzZXJuYW1lIjoia2VycmlrIiwiZmlyc3ROYW1lIjoiS2VycmlseW4iLCJsYXN0TmFtZSI6Iktlbm5lZHkiLCJwYXNzd29yZCI6IjEyMzQiLCJjcmVhdGVkQXQiOiIyMDI0LTA0LTE5VDEwOjE4OjE1LjA0OFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTA0LTE5VDEwOjE4OjE1LjA0OFoiLCJ1bml0SWQiOjIsInJvbGVJZCI6Miwicm9sZSI6eyJpZCI6MiwibmFtZSI6IkFETUlOIiwiY3JlYXRlZEF0IjoiMjAyNC0wNC0xOVQxMDoxODoxNS4wMDFaIiwidXBkYXRlZEF0IjoiMjAyNC0wNC0xOVQxMDoxODoxNS4wMDFaIn0sImlhdCI6MTcxNDczNzY5MH0.Cw-4oKWYInyeDjR70LQVw9XQt4oLQk4WbVCdy0XRAz8';

test("server-side-error", async () => {
    const response = await request(app).get('/channel').set('Authorization', bearerToken);
    //console.dir("response is:");
    //console.dir(response);
    console.log(`response.status is ${response.status}`);
    expect(response.status).toBe(500);
});

test("get-channel-invalid-body", async () => {
    const response = await request(app).get('/channel').set('Authorization', bearerToken);
    console.log(`response.status is ${response.status}`);
});


