from ctypes import addressof
from unittest import result
from odoo import models, fields, api, _

import requests
from odoo.http import request

class KakaoMapView(models.Model):
    _name = "kakao.map.view"
    _description = "kakao map view"
    _rec_name = "name"

    name = fields.Char(string="Name", help="Model Function Name")
    address = fields.Char(stirng="Address")
    Latitude_x = fields.Float(string='Latitude', digits=(10, 7))
    Longitude_y = fields.Float(string='Longitude', digits=(10, 7))

    # C:\Language\odoo\server\odoo\addons\base\models\res_partner.py
   

    def getLatlng(self, address):
        result = ""
        url = 'https://dapi.kakao.com/v2/local/search/address.json?query=' + address
        header = {"Authorization": "KakaoAK 317830c93ac8458ae8f7299c4eb482f5"}
        print('주소 ===>', address, '\n', url)


        r = requests.get(url, headers=header)

        if r.status_code == 200:
            # print('json ---->', r.json())
            result_address = r.json()["documents"] #[0] #["address"]
            #result_address = result_address["documents"][0]["address"]
            if result_address:
                print(result_address)
                result = result_address[0]["address"]["y"], result_address[0]["address"]["x"]
            else:
                result = "ERROR[" + str(r.status_code) + ", but Not Found]"
                print(result)
        else: 
            result = "ERROR[" + str(r.status_code) + "]"

        print('LatLng =>>>> ', result)

        return result

    


    def getKakaoMapHtml(self, address_latlng):
        javascript_key = "1be33e85dfaa3433e7be748d25c77551"

        result = ""
        result = result + "<div id='map' style='width:300px;height:200px;display:inline-block;'></div>" + "\n"
        result = result + "<script type='text/javascript' src='//dapi.kakao.com/v2/maps/sdk.js?appkey=" + javascript_key + "'></script>" + "\n"
        result = result + "<script>" + "\n"
        result = result + "    var container = document.getElementById('map'); " + "\n"
        result = result + "    var options = {" + "\n"
        result = result + "         center: new kakao.maps.LatLng(" + address_latlng[0] + ", " +  address_latlng[1] + ")," + "\n"
        result = result + "         level: 3" + "\n"
        result = result + "   }; " + "\n"
        result = result + "    var map = new kakao.maps.Map(container, options); " + "\n"

        # 마커 생성
        result = result + "   var markerPosition  = new kakao.maps.LatLng(" + address_latlng[0] + ", " + address_latlng[1] + ");  " + "\n"
        result = result + "   var marker = new kakao.maps.Marker({position: markerPosition}); " + "\n"
        result = result + "   marker.setMap(map); " + "\n"

        result = result + "</script>" + "\n"

        return result

    @api.onchange('address')
    def onchange_address(self):
        # if self.address:
        #     for rec in self:
        #         print(rec.address)
        if self.address:
            rrrr = self.getLatlng(self.address)
            if str(rrrr).find("ERROR") < 0:
                #for rec in self:
                print('위도', rrrr[0])
                self.Latitude_x = (rrrr[0])
                print('경도', rrrr[1])
                self.Longitude_y = (rrrr[1])        
                # print(rrrr)
                #return self.

            
        


        
         
        


    
        

    # def getHtmlFromAddress(self, address):
    #     print('처음==>', address)

    #     address_latlng = self.getLatlng(address)
    #     print('ADDR =>>>> ', address_latlng)
     
    #     #좌표로 지도 첨부 HTML 생성
    #     if str(address_latlng).find("ERROR") < 0:
    #         map_html = self.getKakaoMapHtml(address_latlng)
    #         print(map_html)

    #         return map_html
    #     else:
    #         print("[ERROR]getLatLng")
    #         return "[ERROR]getLatLng"
    


    # if __name__ == "__main__":
    #     address = "창원 마산합포구 월영마을로 52"

    #     #카카오 REST API로 좌표 구하기
    #     address_latlng = getLatlng(address)

    #     #좌표로 지도 첨부 HTML 생성
    #     if str(address_latlng).find("ERROR") < 0:
    #         map_html = getKakaoMapHtml(address_latlng)

    #         print(map_html)
    #     else:
    #         print("[ERROR]getLatLng")
