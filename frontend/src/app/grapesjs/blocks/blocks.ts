import { BlockConfig } from "grapesjs"
import { ComponentTypeConfig} from "grapesjs"

// export class GrapeJSBlocks {
//   static get section() : BlockConfig { 
//     return {
//       id: 'section',
//       label: 'Section', 
//       attributes: { class: 'gjs-block-section' },
//       content: 
//         `<section>
//           <h1>Title</h1>
//           <div>
//             Replace this text with actual content
//           </div>
//         </section>`,
//     }
//   }

//   static get paragraph() : BlockConfig { 
//     return {
//       id: 'paragraph',
//       label: 'Paragraph', 
//       attributes: { class: 'gjs-block-section' },
//       content: 
//         `
//         <p>Title</p>
//         `,
//     }
//   }
// }




export interface GrapeJSBlock {
  typeConfig?: ComponentTypeConfig;
  blockConfig: BlockConfig;
}

export class GrapeJSBlocks {
  static get placeholderLink(): GrapeJSBlock {
    return {
      blockConfig: {
        category: 'Placeholders',
        id: 'placeholderLink',
        label: 'Link',
        content:
          `<span>{{link}}</span>`,
      }
    }
  }

  static get placeholderEmployeeFullName(): GrapeJSBlock {
    return {
      blockConfig: {
        category: 'Placeholders',
        id: 'employeeFullName',
        label: 'Employee Full Name',
        content:
          `<span>{{employeeFullName}}</span>`,
      }
    }
  }

  static get placeholderEmployeeFirstName(): GrapeJSBlock {
    return {
      blockConfig: {
        category: 'Placeholders',
        id: 'employeeFirstName',
        label: 'Employee First Name',
        content:
          `<span>{{employeeFirstName}}</span>`,
      }
    }
  }

  static get placeholderEmployeeLastName(): GrapeJSBlock {
    return {
      blockConfig: {
        category: 'Placeholders',
        id: 'employeeLastName',
        label: 'Employee Last Name',
        content:
          `<span>{{employeeLastName}}</span>`,
      }
    }
  }

  static get placeholderCurrentDate(): GrapeJSBlock {
    return {
      blockConfig: {
        category: 'Placeholders',
        id: 'currentDate',
        label: 'Current Date',
        content:
          `<span>{{currentDate}}</span>`,
      }
    }
  }

  static get titleSubtitleSlide(): GrapeJSBlock {
    const titleSubtitleSlideSVG = `<div style="text-align: center"><svg style="width: 50%; height: 50%"
 viewBox="0 0 132.29166 132.29167"
   version="1.1"
   id="svg5"
   inkscape:version="1.1.1 (3bf5ae0d25, 2021-09-20)"
   sodipodi:docname="titleSubtitle.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="true"
     inkscape:document-units="px"
     showgrid="false"
     units="px"
     width="500px"
     inkscape:showpageshadow="false"
     borderlayer="false"
     showborder="true"
     inkscape:zoom="1.4841611"
     inkscape:cx="261.42715"
     inkscape:cy="245.93018"
     inkscape:window-width="1920"
     inkscape:window-height="1011"
     inkscape:window-x="0"
     inkscape:window-y="32"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1" />
  <defs
     id="defs2" />
  <g
     inkscape:label="Слой 1"
     inkscape:groupmode="layer"
     id="layer1">
    <rect
       style="fill-rule:evenodd;stroke-width:0.264583"
       id="rect31"
       width="105.54394"
       height="26.60623"
       x="13.368618"
       y="13.240425" />
    <rect
       style="stroke-width:0.264583"
       id="rect55"
       width="78.940536"
       height="13.486822"
       x="26.607069"
       y="52.951851" />
  </g>
</svg></div>`
    return {
      blockConfig: {
        category: 'Layouts',
        id: 'titleSubtitleSlide',
        label: 'Title slide',
        media: titleSubtitleSlideSVG,
        content: `
        <h1 style="text-align: center">Double click to edit title</h1>
        <h2 style="text-align: center">Double click to edit subtitle</h2>
        `,
      },
    }
  }

  static get basicTitleTextSlide(): GrapeJSBlock {
    const basicTitleTextSlideSVG = `<div style="text-align: center"><svg style="width: 50%; height: 50%"
 viewBox="0 0 132.29166 132.29167"
   version="1.1"
   id="svg5"
   inkscape:version="1.1.1 (3bf5ae0d25, 2021-09-20)"
   sodipodi:docname="basicSlide.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="true"
     inkscape:document-units="px"
     showgrid="false"
     units="px"
     width="500px"
     inkscape:showpageshadow="false"
     borderlayer="false"
     showborder="true"
     inkscape:zoom="1.4841611"
     inkscape:cx="261.42715"
     inkscape:cy="246.60396"
     inkscape:window-width="1920"
     inkscape:window-height="1011"
     inkscape:window-x="0"
     inkscape:window-y="32"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1"
     showguides="false" />
  <defs
     id="defs2" />
  <g
     inkscape:label="Слой 1"
     inkscape:groupmode="layer"
     id="layer1">
    <rect
       style="fill-rule:evenodd;stroke-width:0.264583"
       id="rect31"
       width="105.54394"
       height="26.60623"
       x="13.368618"
       y="13.240425" />
    <rect
       style="stroke-width:0.264583"
       id="rect55"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="52.795517" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-3"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="65.086998" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-6"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="77.378487" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-3-7"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="89.669983" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-3-7-5"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="101.96146" />
  </g>
</svg></div>`
    return {
      blockConfig: {
        category: 'Layouts',
        id: 'basicTitleTextSlide',
        label: 'Basic slide',
        media: basicTitleTextSlideSVG,
        content: `
        <h1>Double click to edit title</h1>
        <p>Double click to edit text</p>
        `,
      },
    }
  }

  static get sectionTitleTextSlide(): GrapeJSBlock {
    const sectionTitleTextSlideSVG = `<div style="text-align: center"><svg style="width: 50%; height: 50%"
 viewBox="0 0 132.29166 132.29167"
   version="1.1"
   id="svg5"
   inkscape:version="1.1.1 (3bf5ae0d25, 2021-09-20)"
   sodipodi:docname="sectionSlide.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="true"
     inkscape:document-units="px"
     showgrid="false"
     units="px"
     width="500px"
     inkscape:showpageshadow="false"
     borderlayer="false"
     showborder="true"
     inkscape:zoom="1.4841611"
     inkscape:cx="261.42715"
     inkscape:cy="245.93018"
     inkscape:window-width="1920"
     inkscape:window-height="1011"
     inkscape:window-x="0"
     inkscape:window-y="32"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1"
     showguides="false"
     inkscape:snap-global="false" />
  <defs
     id="defs2" />
  <g
     inkscape:label="Слой 1"
     inkscape:groupmode="layer"
     id="layer1">
    <rect
       style="fill-rule:evenodd;stroke-width:0.264583"
       id="rect31"
       width="105.54394"
       height="26.60623"
       x="13.368618"
       y="13.240425" />
    <rect
       style="stroke-width:0.264583"
       id="rect55"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="52.795517" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-3"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="65.086998" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-6"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="77.378487" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-3-7"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="89.669983" />
    <rect
       style="stroke-width:0.264583"
       id="rect55-3-7-5"
       width="106.17786"
       height="6.5507379"
       x="13.116719"
       y="101.96146" />
    <g
       id="g6896">
      <path
         id="rect322"
         style="fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:5.00001;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"
         d="M 24.861328,25.857422 V 435.44531 H 475.05859 V 25.857422 Z m 5.574219,5.982422 H 468.71484 V 428.9668 H 30.435547 Z"
         transform="scale(0.26458333)" />
    </g>
  </g>
</svg></div>`
    return {
      blockConfig: {
        category: 'Layouts',
        id: 'sectionTitleTextSlide',
        label: 'Section slide',
        media: sectionTitleTextSlideSVG,
        content: `
        <section><h1>Double click to edit title</h1>
        <p>Double click to edit text</p></section>
        `,
      },
    }
  }

  static get twoPaneSlide(): GrapeJSBlock {
    const twoPaneSlideSVG = `<div style="text-align: center"><svg style="width: 50%; height: 50%"
 viewBox="0 0 132.29166 132.29167"
   version="1.1"
   id="svg5"
   inkscape:version="1.1.1 (3bf5ae0d25, 2021-09-20)"
   sodipodi:docname="twoPaneSlide.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="true"
     inkscape:document-units="px"
     showgrid="false"
     units="px"
     width="500px"
     inkscape:showpageshadow="false"
     borderlayer="false"
     showborder="true"
     inkscape:zoom="1.4841611"
     inkscape:cx="261.42715"
     inkscape:cy="246.60396"
     inkscape:window-width="1920"
     inkscape:window-height="1011"
     inkscape:window-x="0"
     inkscape:window-y="32"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1"
     showguides="false" />
  <defs
     id="defs2" />
  <g
     inkscape:label="Слой 1"
     inkscape:groupmode="layer"
     id="layer1">
    <rect
       style="fill-rule:nonzero;stroke-width:0.264583"
       id="rect31"
       width="105.54394"
       height="26.60623"
       x="13.368618"
       y="13.240425" />
    <g
       id="g6221">
      <rect
         style="stroke-width:0.17717"
         id="rect55"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="52.795517" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="65.086998" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-6"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="77.378487" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3-7"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="89.669983" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3-7-5"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="101.96146" />
    </g>
    <g
       id="g6251">
      <rect
         style="stroke-width:0.17717"
         id="rect55-5"
         width="47.608921"
         height="6.5507379"
         x="71.231552"
         y="52.411625" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3-6"
         width="47.608921"
         height="6.5507379"
         x="71.231552"
         y="64.70311" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-6-2"
         width="47.608921"
         height="6.5507379"
         x="71.231552"
         y="76.994598" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3-7-9"
         width="47.608921"
         height="6.5507379"
         x="71.231552"
         y="89.286095" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3-7-5-1"
         width="47.608921"
         height="6.5507379"
         x="71.231552"
         y="101.57757" />
    </g>
  </g>
</svg></div>`
    return {
      blockConfig: {
        category: 'Layouts',
        id: 'twoPaneSlide',
        label: 'Two pane slide',
        media: twoPaneSlideSVG,
        content: `
        <table style="width: 100%"><tr><td colspan="2"><h1>Double click to edit title</h1></td></tr>
        <tr><td style="width: 50%"><p>Double click to edit text</p></td><td style="width: 50%"><p>Double click to edit text</p></td></tr></table>
        `,
      },
    }
  }

  static get imageSlide(): GrapeJSBlock {
    const imageSlideSVG = `<div style="text-align: center"><svg style="width: 50%; height: 50%"
 viewBox="0 0 132.29166 132.29167"
   version="1.1"
   id="svg5"
   inkscape:version="1.1.1 (3bf5ae0d25, 2021-09-20)"
   sodipodi:docname="imageSlide.svg"
   xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
   xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
   xmlns="http://www.w3.org/2000/svg"
   xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview
     id="namedview7"
     pagecolor="#ffffff"
     bordercolor="#666666"
     borderopacity="1.0"
     inkscape:pageshadow="2"
     inkscape:pageopacity="0.0"
     inkscape:pagecheckerboard="true"
     inkscape:document-units="px"
     showgrid="false"
     units="px"
     width="500px"
     inkscape:showpageshadow="false"
     borderlayer="false"
     showborder="true"
     inkscape:zoom="1.4841611"
     inkscape:cx="261.42715"
     inkscape:cy="234.47589"
     inkscape:window-width="1920"
     inkscape:window-height="1011"
     inkscape:window-x="0"
     inkscape:window-y="32"
     inkscape:window-maximized="1"
     inkscape:current-layer="layer1"
     showguides="false"
     inkscape:snap-grids="false"
     inkscape:snap-to-guides="false"
     inkscape:snap-others="false"
     inkscape:object-nodes="false"
     inkscape:snap-nodes="false"
     inkscape:snap-global="false" />
  <defs
     id="defs2" />
  <g
     inkscape:label="Слой 1"
     inkscape:groupmode="layer"
     id="layer1">
    <rect
       style="fill-rule:evenodd;stroke-width:0.177284"
       id="rect31"
       width="47.385742"
       height="26.60623"
       x="13.368618"
       y="13.240425" />
    <g
       id="g5276">
      <rect
         style="stroke-width:0.17717"
         id="rect55"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="52.795517" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="65.086998" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-6"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="77.378487" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3-7"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="89.669983" />
      <rect
         style="stroke-width:0.17717"
         id="rect55-3-7-5"
         width="47.608921"
         height="6.5507379"
         x="13.116719"
         y="101.96146" />
    </g>
    <g
       id="g1963">
      <path
         id="rect1939"
         style="fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.77953"
         transform="scale(0.26458333)"
         d="M 272.7832,47.515625 V 408.55469 H 449.17969 V 47.515625 Z m 10.43555,11.087891 H 438.81836 V 399.01758 H 283.21875 Z" />
    </g>
    <g
       id="g1963-6"
       transform="matrix(0.71322542,0,0,0.67033871,27.523634,20.400119)">
      <path
         id="rect1939-7"
         style="fill-opacity:1;fill-rule:evenodd;stroke:none;stroke-width:3.77953"
         transform="scale(0.26458333)"
         d="M 272.7832,47.515625 V 408.55469 H 449.17969 V 47.515625 Z m 10.43555,11.087891 H 438.81836 V 399.01758 H 283.21875 Z" />
    </g>
    <ellipse
       style="fill-opacity:1;stroke:none;stroke-width:1.62405;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0"
       id="path2091"
       cx="89.628815"
       cy="39.918465"
       rx="4.3140969"
       ry="4.2833939"
       inkscape:label="path2091" />
    <path
       sodipodi:type="star"
       style="fill-opacity:1;stroke:none;stroke-width:5;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0"
       id="path2775"
       inkscape:flatsided="false"
       sodipodi:sides="3"
       sodipodi:cx="386.81339"
       sodipodi:cy="228.97701"
       sodipodi:r1="20.953247"
       sodipodi:r2="17.178366"
       sodipodi:arg1="2.6218847"
       sodipodi:arg2="3.6690823"
       inkscape:rounded="0"
       inkscape:randomized="0"
       d="m 368.62672,239.38295 3.3433,-19.05295 14.92489,-12.30608 14.82868,12.42185 3.19494,19.07838 -18.17198,6.63109 z"
       transform="matrix(0.35708897,0.07076382,-0.07120186,0.35929942,-21.811509,-58.053074)"
       inkscape:transform-center-x="0.15042435"
       inkscape:transform-center-y="-0.6107616" />
    <path
       sodipodi:type="star"
       style="fill-opacity:1;stroke:none;stroke-width:5;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0"
       id="path2777"
       inkscape:flatsided="false"
       sodipodi:sides="5"
       sodipodi:cx="319.24744"
       sodipodi:cy="251.1925"
       sodipodi:r1="25.857855"
       sodipodi:r2="21.199381"
       sodipodi:arg1="0.90645246"
       sodipodi:arg2="1.534771"
       inkscape:rounded="0"
       inkscape:randomized="0"
       d="m 335.18991,271.55095 -15.17892,0.82718 -15.19909,0.26767 -5.47724,-14.1804 -4.95135,-14.37247 11.7938,-9.59115 12.13899,-9.15035 12.76621,8.25274 12.45365,8.71725 -3.90385,14.69162 z"
       transform="matrix(0.26447981,-0.08500607,0.08673892,0.26987126,-16.026096,26.507155)"
       inkscape:transform-center-x="1.1056174"
       inkscape:transform-center-y="0.3352545" />
    <rect
       style="fill-opacity:1;stroke:none;stroke-width:1.32292;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0"
       id="rect2989"
       width="8.8560925"
       height="9.1942368"
       x="96.890388"
       y="76.834694" />
  </g>
</svg></div>`
    return {
      blockConfig: {
        category: 'Layouts',
        id: 'imageSlide',
        label: 'Image slide',
        media: imageSlideSVG,
        content: [{
          type: 'table',
          style: {width: '100%'},
          attributes: {cellspacing: '0'},
          resizable: true,
          components: [{
            type: 'row',
            resizable: true,
            components: [{
              type: 'cell',
              resizable: true,
              style: {width: '40%'},
              attributes: {valign: 'top'},
              components: [{
                type: 'table',
                resizable: true,
                attributes: {cellspacing: '0', width: '100%', height: '100%'},
                components: [{
                  type: 'row',
                  resizable: true,
                  components: [{
                    type: 'cell',
                    attributes: {width: '100%', height: '20%'},
                    components: [{
                      tagName: 'h1',
                      type: 'text',
                      components: [{type: 'textnode', content: 'Double click to edit title'}]
                    }]
                  }]
                }, {
                  type: 'row',
                  resizable: true,
                  components: [{
                    type: 'cell',
                    attributes: {width: '100%', height: '80%', valign: 'top'},
                    components: [{
                      tagName: 'p',
                      type: 'text',
                      components: [{type: 'textnode', content: 'Double click to edit text'}]
                    }]
                  }]
                }]
              }]
            }, {
              type: 'cell',
              resizable: true,
              style: {width: '60%'},
              components: [{type: 'image', style: {width: '100%'}}]
            }]
          }]
        }],
      },
    }
  }
}