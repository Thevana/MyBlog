package myBlog.api;

import java.util.ArrayList;

import javax.inject.Named;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.springframework.web.bind.annotation.RequestBody;

import myBlog.model.User;

@Named
@Path("/user")
public class UserService {
	
	private static long userIdCounter = 0;
	private static ArrayList<User> users = new ArrayList<User>();
	
	@GET
	@Path("all")
	@Produces(MediaType.APPLICATION_JSON)
	public ArrayList<User> all() {
		return users;
	}
	
	@GET
	@Path("isAlreadyExist")
	@Produces(MediaType.APPLICATION_JSON)
	public boolean isAlreadyExist(@QueryParam("pseudo") String pseudo) {
		for(User user : users) {
			if(user.getPseudo().equalsIgnoreCase(pseudo)) { // "equalsIgnoreCase" parce qu'on peut aussi avoir le cas "TOTO" et "ToTo"
				return true;
			}
		}
		return false;
	}
	
	@POST
	@Path("add")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public boolean add(@RequestBody User user) {
		if(!user.getPseudo().matches("\\s*") && !user.getPassword().matches("\\s*") && !isAlreadyExist(user.getPseudo())) {
			user.setId(userIdCounter++);
			return users.add(user);
		}
		return false;
	}
	
	@POST
	@Path("authenticate")
	@Produces(MediaType.APPLICATION_JSON)
	@Consumes(MediaType.APPLICATION_JSON)
	public User authenticate(@RequestBody User userToAuthenticate) {
		for(User user : users) {
			if(user.getPseudo().equals(userToAuthenticate.getPseudo()) && user.getPassword().equals(userToAuthenticate.getPassword())) {
				return user;
			}
		}
		return null;
	}
	
}
