package com.tap;

import com.tap.auth.Secured;
import jakarta.ws.rs.ApplicationPath;
import jakarta.ws.rs.core.Application;

@ApplicationPath("/api/v1")
@Secured
public class TAPApplication extends Application {

}