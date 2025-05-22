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

