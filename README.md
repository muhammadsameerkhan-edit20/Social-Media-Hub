<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
=======
# Social-Media-Hub
SocialHub is a Java-based GUI social media application designed to simulate basic features of a social networking platform. It provides users with the ability to register an account and log in using valid credentials

Objective
The objective of developing SocialHub is to build a simple yet functional social media application with a graphical user interface...
System Design
The system design of SocialHub consists of several main classes, each with specific responsibilities: User, Post, Comment, and SocialMediaApp...
Implementation
Below is the source code for the main classes used in this application:
User.java

public class User {
    private String username;
    private String password;

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public boolean checkPassword(String password) {
        return this.password.equals(password);
    }
}

Post.java

import java.util.ArrayList;
import java.util.List;

public class Post {
    private User author;
    private String content;
    private List<Comment> comments;

    public Post(User author, String content) {
        this.author = author;
        this.content = content;
        this.comments = new ArrayList<>();
    }

    public User getAuthor() {
        return author;
    }

    public String getContent() {
        return content;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void addComment(Comment comment) {
        comments.add(comment);
    }
}

Comment.java

public class Comment {
    private User author;
    private String content;

    public Comment(User author, String content) {
        this.author = author;
        this.content = content;
    }

    public User getAuthor() {
        return author;
    }

    public String getContent() {
        return content;
    }
}

SocialMediaApp.java
import javax.swing.*;
import java.awt.*;
import java.awt.event.*;
import java.util.ArrayList;
import java.util.List;

public class SocialMediaApp {
    private List<User> users = new ArrayList<>();
    private List<Post> posts = new ArrayList<>();
    private User currentUser;

    private JFrame frame;
    private JTextArea feedArea;
    private JTextField postField;
    private JTextField commentField;

    public SocialMediaApp() {
        initializeUI();
    }

    private void initializeUI() {
        frame = new JFrame("SocialHub");
        frame.setSize(600, 500);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setLayout(new BorderLayout());

        showLoginPanel();
        frame.setVisible(true);
    }

    private void showLoginPanel() {
        JPanel panel = new JPanel(new GridLayout(4, 2));

        JTextField usernameField = new JTextField();
        JPasswordField passwordField = new JPasswordField();

        JButton loginButton = new JButton("Login");
        JButton registerButton = new JButton("Register");

        panel.add(new JLabel("Username:"));
        panel.add(usernameField);
        panel.add(new JLabel("Password:"));
        panel.add(passwordField);
        panel.add(loginButton);
        panel.add(registerButton);

        frame.getContentPane().removeAll();
        frame.getContentPane().add(panel, BorderLayout.CENTER);
        frame.revalidate();
        frame.repaint();

        loginButton.addActionListener(e -> {
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());

            for (User user : users) {
                if (user.getUsername().equals(username) && user.checkPassword(password)) {
                    currentUser = user;
                    showMainPanel();
                    return;
                }
            }

            JOptionPane.showMessageDialog(frame, "Invalid login credentials");
        });

        registerButton.addActionListener(e -> {
            String username = usernameField.getText();
            String password = new String(passwordField.getPassword());

            if (!username.isEmpty() && !password.isEmpty()) {
                users.add(new User(username, password));
                JOptionPane.showMessageDialog(frame, "Registration successful");
            } else {
                JOptionPane.showMessageDialog(frame, "Please enter both username and password");
            }
        });
    }

    private void showMainPanel() {
        JPanel panel = new JPanel(new BorderLayout());

        feedArea = new JTextArea();
        feedArea.setEditable(false);
        JScrollPane scrollPane = new JScrollPane(feedArea);

        postField = new JTextField();
        JButton postButton = new JButton("Post");

        JPanel postPanel = new JPanel(new BorderLayout());
        postPanel.add(postField, BorderLayout.CENTER);
        postPanel.add(postButton, BorderLayout.EAST);

        commentField = new JTextField();
        JButton commentButton = new JButton("Comment");

        JPanel commentPanel = new JPanel(new BorderLayout());
        commentPanel.add(commentField, BorderLayout.CENTER);
        commentPanel.add(commentButton, BorderLayout.EAST);

        panel.add(scrollPane, BorderLayout.CENTER);
        panel.add(postPanel, BorderLayout.NORTH);
        panel.add(commentPanel, BorderLayout.SOUTH);

        frame.getContentPane().removeAll();
        frame.getContentPane().add(panel);
        frame.revalidate();
        frame.repaint();

        postButton.addActionListener(e -> {
            String content = postField.getText();
            if (!content.isEmpty()) {
                posts.add(new Post(currentUser, content));
                postField.setText("");
                updateFeed();
            }
        });

        commentButton.addActionListener(e -> {
            String content = commentField.getText();
            if (!content.isEmpty() && !posts.isEmpty()) {
                Post lastPost = posts.get(posts.size() - 1); // Commenting on latest post
                lastPost.addComment(new Comment(currentUser, content));
                commentField.setText("");
                updateFeed();
            }
        });

        updateFeed();
    }

    private void updateFeed() {
        StringBuilder feedContent = new StringBuilder();

        for (Post post : posts) {
            feedContent.append(post.getAuthor().getUsername()).append(": ").append(post.getContent()).append("\n");
            for (Comment comment : post.getComments()) {
                feedContent.append("  ↳ ").append(comment.getAuthor().getUsername()).append(": ").append(comment.getContent()).append("\n");
            }
            feedContent.append("\n");
        }

        feedArea.setText(feedContent.toString());
    }

    public static void main(String[] args) {
        SwingUtilities.invokeLater(SocialMediaApp::new);
    }
}


// Full SocialMediaApp.java content truncated for brevity. Include complete code in final document if needed.

Screenshots
You can add GUI screenshots here using Word or by pasting directly in the document.
Results
The app successfully allows users to register, login, create posts, and comment on posts via a GUI.
Conclusion
SocialHub demonstrates the integration of Java Swing for GUI with object-oriented programming to simulate social media functionalities.
Future Improvements
1. Persistent file/database storage
2. Profile management
3. Image upload support
4. Notifications
5. Improved UI/UX

