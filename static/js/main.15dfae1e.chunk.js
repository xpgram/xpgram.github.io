(this["webpackJsonpreact-test"]=this["webpackJsonpreact-test"]||[]).push([[0],[,,,,,,,,,,,function(e,t,n){e.exports={background:"Contact_background__mCPuB",header:"Contact_header__1XM0l",text:"Contact_text__1Pd1Y",input:"Contact_input__2dq_M",button:"Contact_button__15F0C",prankText:"Contact_prankText__16ITI",prankTextShow:"Contact_prankTextShow__25SAU"}},,function(e,t,n){e.exports={container:"PortfolioItem_container__2eWI2",frostedGlass:"PortfolioItem_frostedGlass__1p-l_",visualWrapper:"PortfolioItem_visualWrapper___KSbU",visual:"PortfolioItem_visual__VtDgC",visualHover:"PortfolioItem_visualHover__3UNkP",title:"PortfolioItem_title__2QjH4"}},function(e,t,n){e.exports={linkWrapper:"Button_linkWrapper__30rpj",lightbar:"Button_lightbar__1lFRR",light:"Button_light__kC11L",text:"Button_text__22kJD",icon:"Button_icon__1Ixdg"}},function(e,t,n){e.exports={wrapper:"Bio_wrapper__1vLbo",attentionGrabber:"Bio_attentionGrabber__nD76O",text:"Bio_text__3KAs1"}},,function(e,t,n){e.exports={landing:"Landing_landing__2F-kx",background:"Landing_background__107Fr",logo:"Landing_logo__2jSYP",glow:"Landing_glow__ezgJ0"}},,,function(e,t,n){e.exports={background:"Portfolio_background__qEQgX",container:"Portfolio_container__ldlva"}},function(e,t,n){e.exports={background:"Footer_background__2UkBM",text:"Footer_text__3mSNu"}},,,,,,,,,,,,function(e,t,n){},function(e,t,n){},function(e,t,n){},,,,,,,function(e,t,n){"use strict";n.r(t);var a=n(1),i=n.n(a),r=n(25),c=n.n(r),s=(n(33),n(26)),o=n(6),l=n(2),u=n(5),d=n(4),m=n(3),j=(n(34),n(35),n(0)),b="DEVIN",h="VALKO",p="".concat(b).concat(h),O=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).textStabilizationCurve=function(e){return(0,Math.trunc)(2*e+10)},e}return Object(u.a)(n,[{key:"render",value:function(){for(var e=[],t="".concat(b,".").concat(h),n=0;n<t.length;n++)"."!==t[n]?e.push(Object(j.jsx)("span",{className:"glitch-text-letter",children:Object(j.jsx)(v,{actual:t[n],changeCount:this.textStabilizationCurve(n),stabilize:this.props.stabilize})},"glitch-letter_".concat(n))):e.push(Object(j.jsx)("span",{className:"glitch-text-letter glitch-text-separator",children:"."},"glitch-letter_".concat(n)));return Object(j.jsx)("div",{className:"glitch-text",children:e})}}]),n}(a.Component),v=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e))._shortTimer=40,a._medTimer=850,a._longTimer=2700,a.componentDidMount=function(){a.update()},a.componentDidUpdate=function(e){e.stabilize!==a.props.stabilize&&(a.changeCount=a.props.changeCount,clearTimeout(a._timerId),a.update())},a.componentWillUnmount=function(){clearTimeout(a._timerId)},a.wait=function(e,t){return e-e*t+e*t*2*Math.random()},a.shortTimer=function(){return a.wait(a._shortTimer,.05)},a.medTimer=function(){return a.wait(a._medTimer,.9)},a.longTimer=function(){return a.wait(a._longTimer,.7)},a.randomLetter=function(){var e=Math.random()>a.corruptionRate?a.possible:a.possible_ext;return e[Math.floor(Math.random()*e.length)]},a.update=function(){var e=a.props.stabilize&&a.changeCount<=0,t=a.changeCount>0,n=e?a.actual:a.randomLetter();a.setState({render:n,colorize:Math.random()<.2});var i=[a.shortTimer,a.medTimer,a.longTimer],r=i[0],c=i[2],s=e?(0,i[1])():t?r():c();--a.changeCount,a._timerId=setTimeout(a.update,s)},a.state={render:e.actual,colorize:!1},a.actual=e.actual,a.possible=p,a.possible_ext="\u018e\u0418\u039b\u2c6f\ua4d8\u0393\u03a0\u0186",a.changeCount=e.changeCount||10,a.stabilize=e.stabilize||!1,a.corruptionRate=e.corruptionRate||.075,a}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsx)("span",{className:this.state.colorize?"glitch-text-special":"",children:this.state.render})}}]),n}(a.Component),g=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).componentDidMount=function(){a._timerId=setTimeout((function(){a.state.showName&&a.onMouseLeave()}),2500)},a.onMouseEnter=function(){a.setState({showName:!1,hover:!0})},a.onMouseLeave=function(){a.setState({showName:!1,hover:!1})},a.state={showName:!0,hover:!0},a}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsxs)("div",{className:"logo-container",onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,children:[Object(j.jsx)("img",{src:"data:image/png;base64,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",className:"logo-image",alt:"logo"}),Object(j.jsx)("div",{children:Object(j.jsxs)("div",{className:"logo-text",children:[Object(j.jsx)(O,{stabilize:this.state.hover}),Object(j.jsx)("div",{className:"logo-text-glow"})]})})]})}}]),n}(a.Component),x=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).shape=Object(j.jsxs)("svg",{xmlns:"http://www.w3.org/2000/svg",fillRule:"evenodd",strokeLinejoin:"round",strokeMiterlimit:"2",clipRule:"evenodd",viewBox:"0 0 1200 1200",children:[Object(j.jsx)("path",{fill:"none",d:"M0 0h1200v1200H0z"}),Object(j.jsx)("path",{d:"M640.841 240l-140-140H100v824.756C100 1021.54 178.46 1100 275.243 1100H1100V701.005l-140-140V960H240V240h400.842zM850.5 250.503L700 100h400v400L949.5 349.497 698.994 600 600 501.005l250.5-250.502z"})]}),e}return n}(function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){var e;Object(l.a)(this,n);for(var a=arguments.length,i=new Array(a),r=0;r<a;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).shape=Object(j.jsx)(j.Fragment,{}),e}return Object(u.a)(n,[{key:"render",value:function(){return i.a.cloneElement(this.shape,this.props)}}]),n}(a.Component)),f=n(14),A=n.n(f),B=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsx)("a",{className:A.a.linkWrapper,href:this.props.link,target:this.props.external&&"_blank",children:Object(j.jsxs)("button",{className:A.a.text,type:"button",children:[this.props.children,this.props.external&&Object(j.jsx)(x,{className:A.a.icon}),Object(j.jsx)("div",{className:A.a.lightbar,children:Object(j.jsx)("div",{className:A.a.light})})]})})}}]),n}(a.Component),I=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsx)(j.Fragment,{children:Object(j.jsx)("nav",{className:"navbar",children:Object(j.jsxs)("div",{className:"navbar-container",children:[Object(j.jsx)("a",{href:"#landing",className:"navbar-logo",children:Object(j.jsx)(g,{})}),Object(j.jsxs)("ul",{className:"nav-menu",children:[Object(j.jsx)("li",{className:"nav-item",children:Object(j.jsx)(B,{link:"#bio",children:"BIO"})}),Object(j.jsx)("li",{className:"nav-item",children:Object(j.jsx)(B,{link:"#portfolio",children:"WORK"})}),Object(j.jsx)("li",{className:"nav-item",children:Object(j.jsx)(B,{link:"#contact",children:"CONTACT"})}),Object(j.jsx)("li",{className:"nav-item",children:Object(j.jsx)(B,{link:"https://www.linkedin.com/in/deivn-vkola",external:!0,children:"LINKEDIN"})}),Object(j.jsx)("li",{className:"nav-item",children:Object(j.jsx)(B,{link:"https://github.com/xpgram",external:!0,children:"GITHUB"})})]})]})})})}}]),n}(a.Component),w=n(17),M=n.n(w),C=n.p+"static/media/PixilBG_faded.2ed1c1c9.png",_=n.p+"static/media/d.V.6db2b67a.png",N=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsxs)("div",{className:M.a.landing,children:[Object(j.jsx)("img",{className:M.a.background,src:C,alt:""}),Object(j.jsx)("img",{className:M.a.logo,src:_,alt:""}),Object(j.jsx)("div",{className:M.a.glow})]})}}]),n}(a.Component),z=n(15),y=n.n(z),G=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsxs)("div",{className:y.a.wrapper,children:[Object(j.jsx)("h1",{className:y.a.attentionGrabber,children:"Hey"}),Object(j.jsxs)("p",{className:y.a.text,children:["My name is ",Object(j.jsx)("span",{style:{color:"#A7A"},children:"Dei"})," ",Object(j.jsx)("span",{style:{color:"#C7A"},children:"Valko"}),". I am an indie games designer"]}),Object(j.jsx)("p",{className:y.a.text,children:"and artist based in Oregon. This site is still under construction, but I'm not getting any business right now anyway, so whatever."}),Object(j.jsx)("br",{}),Object(j.jsx)("p",{className:y.a.text,children:"Lorem ipsum dolor sit amet, consectetur adipisicing elit. Error iusto delectus quod corrupti necessitatibus magnam perferendis voluptas voluptate totam enim animi rem neque nisi doloribus cumque quis, laborum cum at?"})]})}}]),n}(a.Component),k=n(13),T=n.n(k),L=n.p+"static/media/advance-wars-clone.dea361b1.png",E=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).onMouseEnter=function(){a.setState({hover:!0})},a.onMouseLeave=function(){a.setState({hover:!1})},a.state={hover:!1},a}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsx)("div",{className:T.a.container,onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,onTouchStart:this.onMouseEnter,onTouchEnd:this.onMouseLeave,children:Object(j.jsx)("div",{className:T.a.frostedGlass,children:Object(j.jsxs)("div",{className:T.a.visualWrapper,children:[Object(j.jsx)("img",{className:"".concat(T.a.visual," ").concat(this.state.hover&&T.a.visualHover),src:L,alt:this.props.title}),Object(j.jsx)("h2",{className:T.a.title,children:this.props.title})]})})})}}]),n}(a.Component),R=n(20),F=n.n(R),W=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsx)("div",{className:F.a.background,children:Object(j.jsxs)("div",{className:F.a.container,style:{backgroundImage:"url(".concat(C,")")},children:[Object(j.jsx)(E,{title:"Advance Wars Clone using Pixi.js and my own brain",description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos similique qui sunt exercitationem commodi sint illo velit ea voluptas, maxime aspernatur enim veniam, accusamus modi sed voluptatibus quia? Accusamus rem illo corporis dolorum recusandae excepturi reiciendis a omnis rerum qui."}),Object(j.jsx)(E,{title:"Advance Wars Clone",description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Est atque ab tempora, aspernatur amet, sequi maxime, velit voluptatum fugiat itaque consequatur nemo maiores sapiente quis."}),Object(j.jsx)(E,{title:"Advance Wars Clone I Built Without My Dad's Permission",description:"Lorem ipsum, dolor sit amet consectetur adipisicing elit. Provident quod, sequi odit dolores corrupti quas animi rerum ex in, laudantium itaque eum labore nostrum voluptatem mollitia. Iusto omnis totam dolor ipsa cupiditate quaerat eius suscipit delectus assumenda distinctio! Ab velit necessitatibus assumenda iusto consectetur mollitia, similique molestias quo odio provident perferendis dicta, maiores quibusdam enim quasi, accusamus modi ad deserunt."})]})})}}]),n}(a.Component),D=n(11),J=n.n(D),P=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(e){var a;return Object(l.a)(this,n),(a=t.call(this,e)).onSubmit=function(){a.setState({showMsg:!0}),setTimeout((function(){a.setState({showMsg:!1})}),3e3)},a.state={showMsg:!1},a}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsxs)("div",{className:J.a.background,children:[Object(j.jsx)("h1",{className:J.a.header,children:"Contact"}),Object(j.jsx)("p",{className:J.a.text,children:"Tell me you love me and maybe I'll tell you back."}),Object(j.jsxs)("form",{children:[Object(j.jsx)("textarea",{className:J.a.input,placeholder:"Write your message here."}),Object(j.jsx)("button",{className:J.a.button,type:"button",onClick:this.onSubmit,children:"Submit"})]}),Object(j.jsx)("div",{className:"".concat(J.a.prankText," ").concat(this.state.showMsg&&J.a.prankTextShow),children:"Ha! Pranked you, bro. That button doesn't do anything."})]})}}]),n}(a.Component),Z=n(21),q=n.n(Z),V=n.p+"static/media/PixilBG.b7bc999b.png",S=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var e=(new Date).getFullYear().toString();return Object(j.jsx)("div",{className:q.a.background,style:{backgroundImage:"url(".concat(V,")")},children:Object(j.jsxs)("div",{className:q.a.text,children:["\xa9 DEI VALKO \xa0|\xa0 ",e]})})}}]),n}(a.Component),K=function(e){Object(d.a)(n,e);var t=Object(m.a)(n);function n(){return Object(l.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){return Object(j.jsxs)(j.Fragment,{children:[Object(j.jsx)(I,{}),Object(j.jsx)("span",{id:"landing"}),Object(j.jsx)(N,{}),Object(j.jsx)("span",{id:"bio"}),Object(j.jsx)(G,{}),Object(j.jsx)("span",{id:"portfolio"}),Object(j.jsx)(W,{}),Object(j.jsx)("span",{id:"contact"}),Object(j.jsx)(P,{}),Object(j.jsx)(S,{})]})}}]),n}(a.Component);var H=function(){return Object(j.jsx)("div",{children:Object(j.jsx)(s.a,{children:Object(j.jsx)(o.c,{children:Object(j.jsx)(o.a,{path:"/",component:K,exact:!0})})})})},Q=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,43)).then((function(t){var n=t.getCLS,a=t.getFID,i=t.getFCP,r=t.getLCP,c=t.getTTFB;n(e),a(e),i(e),r(e),c(e)}))};c.a.render(Object(j.jsx)(i.a.StrictMode,{children:Object(j.jsx)(H,{})}),document.getElementById("root")),Q()}],[[42,1,2]]]);
//# sourceMappingURL=main.15dfae1e.chunk.js.map