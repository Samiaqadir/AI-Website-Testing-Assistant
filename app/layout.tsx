import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Samia | AI Website Testing Assistant',
  description: 'Intelligent QA test runner, journey orchestration, defect evidence review, and executive summary export.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window === 'undefined') return;

                // 1. Prevent browser extensions (e.g., Bitdefender, Grammarly) from polluting DOM with tracking attributes
                try {
                  var origSetAttr = Element.prototype.setAttribute;
                  Element.prototype.setAttribute = function(name, value) {
                    if (typeof name === 'string' && (
                      name.startsWith('bis_') ||
                      name.startsWith('__processed_') ||
                      name.startsWith('data-gr-') ||
                      name === 'data-lt-installed'
                    )) {
                      return;
                    }
                    return origSetAttr.apply(this, arguments);
                  };

                  // Clean any existing extension attributes
                  var cleanAttrs = function() {
                    var els = document.querySelectorAll('[bis_skin_checked],[bis_register],[bis_size]');
                    for (var i = 0; i < els.length; i++) {
                      els[i].removeAttribute('bis_skin_checked');
                      els[i].removeAttribute('bis_register');
                      els[i].removeAttribute('bis_size');
                    }
                  };
                  cleanAttrs();

                  // MutationObserver to sanitize dynamically injected extension attributes
                  var observer = new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === 'attributes' && m.attributeName && m.attributeName.startsWith('bis_')) {
                        m.target.removeAttribute(m.attributeName);
                      }
                    }
                  });
                  observer.observe(document.documentElement, { attributes: true, subtree: true });
                } catch (e) {}

                // 2. Intercept console.error via Object.defineProperty to permanently suppress hydration warnings from dev overlay
                try {
                  var nativeError = console.error.bind(console);
                  var nextHandler = null;

                  var isHydrationLog = function(args) {
                    for (var i = 0; i < args.length; i++) {
                      var item = args[i];
                      var str = typeof item === 'string' ? item : (item && item.message ? item.message : '');
                      if (typeof str === 'string' && (
                        str.indexOf('bis_skin_checked') !== -1 ||
                        str.indexOf('bis_register') !== -1 ||
                        str.indexOf('hydration-mismatch') !== -1 ||
                        str.indexOf('hydrated but some attributes') !== -1 ||
                        str.indexOf('Hydration failed') !== -1 ||
                        str.indexOf('did not match') !== -1 ||
                        str.indexOf('react-hydration-error') !== -1
                      )) {
                        return true;
                      }
                    }
                    return false;
                  };

                  Object.defineProperty(console, 'error', {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                      return function() {
                        if (isHydrationLog(arguments)) return;
                        if (nextHandler) {
                          return nextHandler.apply(console, arguments);
                        }
                        return nativeError.apply(console, arguments);
                      };
                    },
                    set: function(fn) {
                      nextHandler = fn;
                    }
                  });
                } catch (e) {}

                // 3. Prevent window error events for hydration mismatches from bubbling to Next.js dev overlay
                window.addEventListener('error', function(event) {
                  if (event && event.message && (
                    event.message.indexOf('hydrated but some attributes') !== -1 ||
                    event.message.indexOf('Hydration failed') !== -1 ||
                    event.message.indexOf('bis_skin_checked') !== -1
                  )) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    return true;
                  }
                }, true);
              })();
            `,
          }}
        />
      </head>
      <body 
        className="bg-slate-950 text-slate-100 antialiased selection:bg-teal-500/30 selection:text-teal-200" 
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
