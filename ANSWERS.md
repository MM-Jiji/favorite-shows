## How to run :

To run this project you need to have node.js installed on your computer.
Then you can run the following commands:

```bash
npm install
```

Then you have two choices :

1. Use the online postgresql database hosted on neon and for that you need to create a .env.local file with the connection string to the database in the root of the project. (this link is where you can find the connection string: https://envshare.dev/unseal#t2sr9HdtBnthVhY7vyfEkfhZNzf8x1u8SCQxeJiD5UsX)

2. Use your own postgresql database hosted on neon (use this stacks because it's already configured) that way you can connect with your own environment variables.
after that you can run the following command to add schema and seed the database with the shows data :


```bash
npm run db:push    # create tables in Neon
npm run db:seed    # insert the shows
```

After you choose one of the two options, you can run the following command to start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Stack choice :

I chose this stack because it's easy to setup and and next.js has shadcn that I find really usefull for implementing the UI components using a clear documentation and it's easy to customize.

Not really a worse choice but in a fast project like this one it's not a best idea to use something that require a lot in term of configuration like python without a framework.


## One real edge case :

One real edge case that my code handles correctly is the persistance of the user data across sessions using a cookie-based session system with a database backend.

The file : src/lib/session.ts handle this logic starting in the line 6 where the cookie is initialized, be used in line 11 to check if the cookie exist and create another if not and store it in the database.

Without that handeling user cannot save there favorites shows and the data will be lost when the session is closed.


##  AI usage :

I am using windsurf as my IDE for coding. I used it to help me with the implementation of the session system and the database schema. I asked it to generate the code for the session system and the database schema.
The AI output generated svg files to handle the images and I correcte it to match the image in /public/shows/.

## Honest gap :

The way the image is handled could be better, and I didn't implement a proper way to upload the images using cloudinary for examples.
Beside AI I need to continue learning the how to setup propper system and logic in the code to handle the data and the user interactions. 

