$(document).ready(function() {

  barba.init({
    transitions: [
      {
        name: 'slide',
        leave(data) {
          return gsap.to(data.current.container, {
            x: '-100%',
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          });
        },
        enter(data) {
          return gsap.from(data.next.container, {
            x: '100%',
            opacity: 0,
            duration: 0.9,
            ease: 'power2.inOut',
          });
        }
      }
    ],
    views: [
      {
        namespace: 'account',
        afterEnter() {
          console.log("Account view loaded")
          initSignupApi(); 
          initSignupFunc();
        }
      },
      {
         namespace: 'gettingStarted',
      afterEnter(){
        console.log("Getting Started view loaded");
        scriptSetup();
      }
    },
    { 
      namespace: 'home',
      afterEnter(){
        initHomeScript();
      }
    },
   { namespace: 'login',
    afterEnter(){
      initLoginApi();
    }}
    ]
  });
  
  
  
  
      
})