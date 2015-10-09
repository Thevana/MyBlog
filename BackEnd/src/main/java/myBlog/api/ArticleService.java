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
	
	private static final SimpleDateFormat dateFormatter = new SimpleDateFormat("dd/MM/yyyy à HH:mm:ss.SS");
	private static long articleIdCounter = 0;
	private static long commentIdCounter = 0;
	private static ArrayList<Article> articles = new ArrayList<Article>();
	
	@GET
	@Path("all")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<Article> all() {
		return articles;
	}
	
	@GET
	@Path("isAnyArticle")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean isAnyArticle() {
		return !articles.isEmpty();
	}
	
	@POST
	@Path("add")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean add(@RequestBody Article article) {
		if(!article.getTitle().matches("\\s*") && !article.getText().matches("\\s*")) {
			article.setId(articleIdCounter++);
			article.setDateOfCreation(dateFormatter.format(new Date()));
			article.setDateOfLastUpdate(article.getDateOfCreation());
			article.setComments(new ArrayList<Comment>());
			
			/* On place l'article créé en tête de file dans l'historique des articles */
			articles.add(0, article);
			
			/* On vérifie si l'article se trouve bien dans la liste */
			return articles.contains(article);
		}
		return false;
	}
	
	@POST
	@Path("update")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean update(@RequestBody Article updateArticle) {
		for(Article article : articles) {
			if(article.getId() == updateArticle.getId()) {
				if(!updateArticle.getTitle().matches("\\s*") && !updateArticle.getText().matches("\\s*")) {
					article.setDateOfLastUpdate(dateFormatter.format(new Date()));
					article.setTitle(updateArticle.getTitle());
					article.setText(updateArticle.getText());
					
					/* On replace l'article en tête de file vu qu'il a été modifié */
					Article articleToReintegrate = articles.remove(articles.indexOf(article));
					articles.add(0, articleToReintegrate);
					
					/* On vérifie si l'article se trouve bien dans la liste */
					return articles.contains(articleToReintegrate);
				}
				return false;
			}
		}
		return false;
	}
	
	@GET
	@Path("delete")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean delete(@QueryParam("id") long id) {
		for(Article article : articles) {
			if(article.getId() == id) {
				return articles.remove(article);
			}
		}
		return false;
	}
	
	@POST
	@Path("addComment")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean addComment(@RequestBody Comment comment) {
		for(Article article : articles) {
			if(article.getId() == comment.getArticleId()) {
				if(!comment.getText().matches("\\s*")) {
					comment.setId(commentIdCounter++);
					comment.setDateOfCreation(dateFormatter.format(new Date()));
					comment.setDateOfLastUpdate(comment.getDateOfCreation());
					
					/* On place le commentaire créé en tête de file dans l'historique des commentaires de l'article */
					article.getComments().add(0, comment);
					
					/* On vérifie si le commentaire se trouve bien dans la liste */
					return article.getComments().contains(comment);
				}
				return false;
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
			for(Comment comment : article.getComments()) {
				if(comment.getId() == updateComment.getId()) {
					if(!updateComment.getText().matches("\\s*")) {
						comment.setDateOfLastUpdate(dateFormatter.format(new Date()));
						comment.setText(updateComment.getText());
						
						/* On replace le commentaire en tête de file vu qu'il a été modifié */
						Comment commentToReintegrate = article.getComments().remove(article.getComments().indexOf(comment));
						article.getComments().add(0, commentToReintegrate);
						
						/* On vérifie si le commentaire se trouve bien dans la liste */
						return article.getComments().contains(commentToReintegrate);
					}
					return false;
				}
			}
		}
		return false;
	}
	
	@GET
	@Path("deleteComment")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean deleteComment(@QueryParam("id") long id) {
		for(Article article : articles) {
			for(Comment comment : article.getComments()) {
				if(comment.getId() == id) {
					return article.getComments().remove(comment);
				}
			}
		}
		return false;
	}
	
}
