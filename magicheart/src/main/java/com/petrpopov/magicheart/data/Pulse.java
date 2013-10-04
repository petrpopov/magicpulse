package com.petrpopov.magicheart.data;

import javax.validation.constraints.NotNull;

/**
 * User: petrpopov
 * Date: 30.09.13
 * Time: 11:53
 */

public class Pulse {

    @NotNull
    private Double value;

    @NotNull
    private Long timestamp;

    public Double getValue() {
        return value;
    }

    public void setValue(Double value) {
        this.value = value;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "Pulse{" +
                "value=" + value +
                ", timestamp=" + timestamp +
                '}';
    }
}
