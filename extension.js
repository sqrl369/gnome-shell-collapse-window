const { Clutter, Meta, St } = imports.gi;
const Main = imports.ui.main;
const Tweener = imports.ui.tweener;

let _originalMinimize = null;

function init() {
    // Save the original minimize function
    _originalMinimize = Meta.Window.prototype.minimize;
}

function enable() {
    // Override the minimize function
    Meta.Window.prototype.minimize = function () {
        if (this.isMaximized()) {
            this.unmaximize();
            Tweener.addTween(this.get_frame_rect(), {
                height: this.title_height,
                time: 0.2,
                transition: 'easeOutQuad',
                onUpdate: rect => {
                    this.move_frame(true, rect.x, rect.y);
                    this.resize_frame(true, rect.width, rect.height);
                },
                onComplete: () => {
                    // Optionally, you can hide the window content here
                    // For example, by setting the opacity or visibility of the content area.
                }
            });
        } else {
            _originalMinimize.call(this);
        }
    };
}

function disable() {
    // Restore the original minimize function
    Meta.Window.prototype.minimize = _originalMinimize;
}
