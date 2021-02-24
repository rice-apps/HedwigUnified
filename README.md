# Welcome to Hedwig.
A revolutionary project designed from the ground up by Rice students for the Rice Community.

In this challenging time, it is imperative that we take all necessary precautions as we begin to navigate life inside the "new normal" of the post COVID-19 era. That is why we have built Hedwig, a web experience which enables Rice students, faculty, and staff to engage with campus food establishments in a safe and frictionless manner. In just a few clicks, any member of the Rice community can place an order and receive updates on its status in real-time; similarly, vendors can view and interact with new orders in real-time, with a comprehensive order management solution backed by a powerful publicly-traded company.

## I'm a developer, how do I get started?
You'll find two main folders in this project.
First, on in the `backend` folder, here are the steps you'll need in order to run your backend:
1. Run `npm install`
2. Copy the contents of `.env.example` into a new `.env` file, and then replace the parts with <PLACEHOLDER> to real values (ask your mentor for this information)
3. You can run your application with `npm run dev`. Now, whenever you make changes to the application, the app will reload.
NOTE: Ensure that your backend is running on Port 3001. Otherwise, some local development settings on the frontend will not work.

In the `frontend` folder, here are the steps you'll need in order to run your frontend:
1. Run `npm install`
2. Use `npm run dev` in order to run your application. Now, whenever you make changes to the application, the app will reload.
NOTE: Ensure that your frontend is running on Port 3000. Otherwise, some local development settings (specifically related to authentication) will not work. If you have questions or need to run the application on a different port, please contact your mentor.

## Great, I'm all set up - but now I want to make changes. Anything I should be aware of?
Thanks for asking! Yes, there is just one thing: make sure to create a NEW BRANCH before making changes! We will use the `master` and `develop` branches for production and staging, respectively; so these will not be directly editable. Furthermore, it is just good practice in development to not make direct changes to these branches. Instead, it is advisable to create a new branch when you'd like to build a new feature, and then use a Pull Request to merge your changes into the deployed version.

The typical workflow will look like this:
1. Create a new branch using `git checkout -b feature/<CUSTOM_BRANCH_NAME>`, and replace <CUSTOM_BRANCH_NAME>.
2. Make your necessary commits, and once they're ready to be integrated with the deployed version, submit a pull request on Github.
3. From there, your mentor will review the PR. They may recommend some changes or revisions that should be made, and in that case you will need to make another commit or two before the PR is approved. 
4. Once the PR is approved, the mentor will merge your PR into the deployed version, and now your code will be integrated in the deployed version of Hedwig. Congratulations!
