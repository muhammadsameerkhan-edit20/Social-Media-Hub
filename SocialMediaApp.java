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
