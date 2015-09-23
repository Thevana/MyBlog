package myBlog.api;

import javax.inject.Named;
import javax.ws.rs.GET;
import javax.ws.rs.Path;

@Named
@Path("/test")
public class TestService {
	
	@GET
	@Path("helloWorld")
	public String helloWorld() {
		return "Hello World !";
	}
	
}
