package com.petrpopov.magicheart.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.UUID;

/**
 * User: petrpopov
 * Date: 30.09.13
 * Time: 12:00
 */

@Controller
public class HomeController {

    @RequestMapping("/")
    public ModelAndView showHomePage() {
        ModelAndView mv = new ModelAndView("index");

        mv.addObject("clientId", UUID.randomUUID());

        return mv;
    }
}
