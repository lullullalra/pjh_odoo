/** @odoo-module **/
import { registry } from "@web/core/registry";
import {Layout} from "@web/views/layout";
import { Model, useModel } from "@web/views/helpers/model";
import { KeepLast } from "@web/core/utils/concurrency";
import { useEffect, useService } from "@web/core/utils/hooks"; 
import rpc from 'web.rpc';
import ajax from 'web.ajax';
import config from 'web.config';
import core from 'web.core';

const QWeb = core.qweb;
    
class KakaoMapModel extends Model {
    static services = ["orm"];
  
    setup(params, { orm }) {
      this.model = params.resModel;
      this.orm = orm;
      this.keepLast = new KeepLast();
    }
  
    async load(params) {
      this.data = await this.keepLast.add(
        this.orm.searchRead(this.model, params.domain, [], { limit: 100 })
      );
      this.notify();
    }
}
KakaoMapModel.services = ["orm"];

class KakaoMapView extends owl.Component {
    setup() {
       this.props.resModel = 'kakao.map.view'
       this.model = useModel(KakaoMapModel, {
        resModel: this.props.resModel,
        //domain: [['ml_project_id', '=', 1]]//this.props.domain,
        });
       console.log('pjh setup ==>', this)
       var self = this
       this.actionService = useService("action");
       this._rpc = useService("rpc");
    //    this._ajax = useService("ajax");
    }

    async willStart() {
        await ajax.loadLibs({
            jsLibs: [
                "//dapi.kakao.com/v2/maps/sdk.js?appkey=1be33e85dfaa3433e7be748d25c77551&autoload=false",
                "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
            ],
        });

        var ttt = new Promise(window.kakao.maps.load)
        ttt.then(function name(params) {  
            console.log(kakao)
        })
    }

    mounted() {
        console.log('mounted ===>', this)
        
        // var kmap = async() => await ajax.loadLibs({
        //     jsLibs: [
        //         "//dapi.kakao.com/v2/maps/sdk.js?appkey=1be33e85dfaa3433e7be748d25c77551",
        //     ],
        // });

        // $.when(kmap).then(function(result) {
        //     console.log('ddddd => ', kakao)
        // })
        // Promise.resolve(kmap).then(() => {
        //     console.log('ddddd => ', kakao)
        // })


        // const rrr = await this._rpc({
        //     route: '/kakao_map/KakaoMapView/getHtmlFromAddress',
        //     params: {
        //         address: '서울',
        //     }
        // });
        // const htmldata = await rpc.query({
        //     model: 'kakao.map.view',
        //     method: 'getKakaoMapHtml',
        //     args: [[], '']
        // });
        // console.log(htmldata)
        
      /*   var def1 =  this._rpc({
            model: 'kakao.map.view',
            method: 'getHtmlFromAddress',
            args: [[], '경남 창원시 마산합포구 월영마을로52']
        }).then(function(result) {
            console.log('rpc ===>', result)
        });
        // return $.when(def1);

        $.when(def1).then(function(result) {
            console.log('promise ==> ', result)
        }) */
    }

    sample6_execDaumPostcode() {
        new daum.Postcode({
            oncomplete: function(data) {
                var addr = '';
                var extraAddr = '';
                if (data.userSelectiedType === 'R') {
                    addr = data.roadAddress;
                } else {
                    addr = data.jibunAddress;
                }
                if(data.userSelectiedType === 'R'){
                    if(data.bname !== '' && /[동|로|가]$/g.test(data.bname)){
                        extraAddr += data.bname;
                    }
                    if(data.buildingName !== '' && data.apartment === 'Y'){
                        extraAddr += (extraAddr !== '' ? ', ' + data.buildingName : data.buildingName);
                    }
                    if(extraAddr !== ''){
                        extraAddr = ' (' + extraAddr + ')';
                    }
                    document.getElementById("sample6_extraAddress").value = extraAddr;

                } else {
                    document.getElementById("sample6_extraAddress").value = '';
                }
                document.getElementById('sample6_postcode').value = data.zonecode;
                document.getElementById("sample6_address").value = addr;
                document.getElementById("sample6_detailAddress").focus();
            }
        }).open();
    }
}


KakaoMapView.type = "kakaomap";
KakaoMapView.display_name = "KakaoMapView";
KakaoMapView.icon = "fa-sitemap";
KakaoMapView.multiRecord = true;
KakaoMapView.searchMenuTypes = ["filter", "favorite"];
KakaoMapView.components = { Layout };
KakaoMapView.template = owl.tags.xml/* xml */ `
<div>
<div id='map' style='width:100%;height:400px;display:inline-block;'></div>
<div id='Latitude_x' t-esc='model.data[0].Latitude_x'></div>
<div id='Longitude_y' t-esc='model.data[0].Longitude_y'></div>
<script>
    var container = document.getElementById('map');
    console.log('박준하 맵 자동 로딩 되나???', parseFloat(document.getElementById('Latitude_x').textContent), document.getElementById('Latitude_x'));
    var options = {
        center: new kakao.maps.LatLng(parseFloat(document.getElementById('Latitude_x').textContent), parseFloat(document.getElementById('Longitude_y').textContent)),
        level: 3
    };
    var map = new kakao.maps.Map(container, options);
    var markerPosition = new kakao.maps.LatLng(parseFloat(document.getElementById('Latitude_x').textContent), parseFloat(document.getElementById('Longitude_y').textContent));
    var marker = new kakao.maps.Marker({position: markerPosition});
    marker.setMap(map);    
</script>
<footer>
    <input type="button" t-on-click="sample6_execDaumPostcode()" value="우편번호 찾기"></input>
    <input type="text" id="sample6_postcode" placeholder="우편번호"></input>
    <input type="text" id="sample6_address" placeholder="주소"></input>
    <input type="text" id="sample6_detailAddress" placeholder="상세주소"></input>
    <input type="text" id="sample6_extraAddress" placeholder="참고항목"></input>
</footer>
</div>
`;

// 시나리오 1 
/*  
    1. qweb template에 * .... *를 템플릿화
    2. mounted 되면 qweb.render
    3. template내 삽입할 노드를 찾고 appendTo
*/
// 시나리오 2: template에 직접 기입하여
/* 

    <div id='map' style='width:300px;height:200px;display:inline-block;'></div>
    <script type='text/javascript' src='//dapi.kakao.com/v2/maps/sdk.js?appkey=1be33e85dfaa3433e7be748d25c77551'></script>
    <script type='text/javascript' src='https://dapi.kakao.com/v2/maps/sdk.js?appkey=1be33e85dfaa3433e7be748d25c77551'></script>
    <script>
        <!-- document.querySelector('span[name=Latitude_x]').textContent -->
    </script>

        var options = {
            center: new kakao.maps.LatLng(document.getElementById('Latitude_x').textContent, document.getElementById('Longitude_y').textContent),
            level: 3
    };
    var map = new kakao.maps.Map(container, options);

    var markerPosition = new kakao.maps.Latlng();
    var marker = new kakao.maps.Marker({position: markerPosition});
    marker.setMap(map);
 */

registry.category("views").add("kakaomap", KakaoMapView);
