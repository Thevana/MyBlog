package myBlog.api;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;

import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import myBlog.model.Article;
import myBlog.model.Comment;

import org.springframework.web.bind.annotation.RequestBody;

@Named
@Path("/article")
public class ArticleService {
	
	private static final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss.SS");
	private static long articleIdCounter = 0;
	private static long commentIdCounter = 0;
	private static ArrayList<Article> articles = new ArrayList<Article>();
	
	@GET
	@Path("all")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Article> all() {
		return articles;
	}
	
	@POST
	@Path("add")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean add(@RequestBody Article article) {
		article.setId(articleIdCounter++);
		article.setDateOfCreation(dateFormatter.format(new Date()));
		article.setDateOfLastUpdate(article.getDateOfCreation());
		article.setComments(new ArrayList<Comment>());
		return articles.add(article);
	}
	
	@POST
	@Path("update")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean update(@RequestBody Article updateArticle) {
		for(Article article : articles) {
			if(article.getId() == updateArticle.getId()) {
				article.setDateOfLastUpdate(dateFormatter.format(new Date()));
				article.setTitle(updateArticle.getTitle());
				article.setText(updateArticle.getText());
				return true;
			}
		}
		return false;
	}
	
	@GET
	@Path("delete")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean delete(@QueryParam("id") int id) {
		for(Article article : articles) {
			if(article.getId() == id) {
				return articles.remove(article);
			}
		}
		return false;
	}
	
	@GET
	@Path("allComments")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Comment> allComments(@QueryParam("articleId") int articleId) {
		for(Article article : articles) {
			if(article.getId() == articleId) {
				return article.getComments();
			}
		}
		return null;
	}
	
	@POST
	@Path("addComment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean addComment(@RequestBody Comment comment) {
		for(Article article : articles) {
			if(article.getId() == comment.getArticleId()) {
				comment.setId(commentIdCounter++);
				comment.setDateOfCreation(dateFormatter.format(new Date()));
				comment.setDateOfLastUpdate(comment.getDateOfCreation());
				return article.getComments().add(comment);
			}
		}
		return false;
	}
	
	@POST
	@Path("updateComment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean update(@RequestBody Comment updateComment) {
		for(Article article : articles) {
			if(article.getId() == updateComment.getArticleId()) {
				for(Comment comment : article.getComments()) {
					if(comment.getId() == updateComment.getId()) {
						comment.setDateOfLastUpdate(dateFormatter.format(new Date()));
						comment.setText(updateComment.getText());
						return true;
					}
				}
			}
		}
		return false;
	}
	
	@GET
	@Path("deleteComment")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean deleteComment(@QueryParam("articleId") int articleId, @QueryParam("commentId") int commentId) {
		for(Article article : articles) {
			if(article.getId() == articleId) {
				for(Comment comment : article.getComments()) {
					if(comment.getId() == commentId) {
						return article.getComments().remove(comment);
					}
				}
			}
		}
		return false;
	}
	
}
