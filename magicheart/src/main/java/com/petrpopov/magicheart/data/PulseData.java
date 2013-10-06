package com.petrpopov.magicheart.data;

import java.util.List;

/**
 * User: petrpopov
 * Date: 30.09.13
 * Time: 12:46
 */

public class PulseData {

    private List<Pulse> pulse;
    private String clientId;
    private int pageNumber;

    public List<Pulse> getPulse() {
        return pulse;
    }

    public void setPulse(List<Pulse> pulse) {
        this.pulse = pulse;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public int getPageNumber() {
        return pageNumber;
    }

    public void setPageNumber(int pageNumber) {
        this.pageNumber = pageNumber;
    }
}
