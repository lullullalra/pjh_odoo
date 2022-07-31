
{
    'name': "Kakao Map View",
    'version': '15.0.1.0.1',
    'summary': """Kakao Map Integration with odoo""",
    'description': """Kakao Map Integration with Odoo.
     박준하의 카카오맵 결합 테스트""",
    'author': 'pjh',
    'sequence': -200,
    'company': 'pjh_company',
    'maintainer': 'pjh_company',
    'depends': ['base', 'web'],
    'data': [
      "security/ir.model.access.csv",
      "views/kakao_map_view.xml"
       
    ],
    'assets': {
        'web.assets_backend': [
          # "https://dapi.kakao.com/v2/maps/sdk.js?appkey=1be33e85dfaa3433e7be748d25c77551",
          "kakao_map/static/src/js/kakao_map_view.js",
          "kakao_map/static/src/scss/kakao_map_view.css"
        ],
        'web.assets_qweb': [
          # "kakao_map/static/src/xml/kakao_map_template.xml"
        ],
    },
    
    'images': ['static/description/카카오.png'],
    'license': "LGPL-3",
    'installable': True,
    'application': True,
    'autoinstall': True
}
