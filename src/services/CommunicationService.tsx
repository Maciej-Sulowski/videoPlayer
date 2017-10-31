import * as React from 'react';
import * as $ from 'jquery';

class CommunicationService {
    private getHTTP;

    constructor() {
        // this.getHTTP = CommunicationService.getHTTP;
    }
    
    static getHTTP(url): any {
        return new Promise((resolve, reject) => {
            $.ajax({
                type: "GET",
                url: url
            }).done((response) => {
                resolve(response);
            }).fail((response) => {
                reject(response);
            });
        });
    }
}

export default CommunicationService;