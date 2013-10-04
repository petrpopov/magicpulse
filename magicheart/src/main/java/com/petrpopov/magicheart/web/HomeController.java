package com.petrpopov.magicheart.web;

import com.petrpopov.magicheart.data.DataSaver;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * User: petrpopov
 * Date: 30.09.13
 * Time: 12:00
 */

@Controller
public class HomeController {

    @Autowired
    private DataSaver dataSaver;

    @RequestMapping("/")
    public ModelAndView showHomePage() {
        ModelAndView mv = new ModelAndView("index");

        mv.addObject("data", dataSaver.getData());

        return mv;
    }
}
