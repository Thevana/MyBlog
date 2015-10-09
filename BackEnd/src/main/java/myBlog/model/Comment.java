package myBlog.model;

public class Comment {

	private long id;
	private long ownerId; // id du créateur du commentaire
	private long articleId;
	private String dateOfCreation;
	private String dateOfLastUpdate;
	private String text;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public long getOwnerId() {
		return ownerId;
	}

	public void setUserId(int ownerId) {
		this.ownerId = ownerId;
	}

	public long getArticleId() {
		return articleId;
	}

	public void setArticleId(int articleId) {
		this.articleId = articleId;
	}

	public String getDateOfCreation() {
		return dateOfCreation;
	}

	public void setDateOfCreation(String dateOfCreation) {
		this.dateOfCreation = dateOfCreation;
	}

	public String getDateOfLastUpdate() {
		return dateOfLastUpdate;
	}

	public void setDateOfLastUpdate(String dateOfLastUpdate) {
		this.dateOfLastUpdate = dateOfLastUpdate;
	}

	public String getText() {
		return text;
	}

	public void setText(String text) {
		this.text = text;
	}

}
