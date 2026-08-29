using System;
using System.Windows.Forms;

namespace MughalMahalMapApp
{
    public partial class MainForm : Form
    {
        private const string MapUrl = "https://www.google.com/maps/place/Mughal+Mahal+Hotel/@32.0868045,74.2012461,17z/data=!4m9!3m8!1s0x391f2ab0db205e03:0xd5edbd6ccd3e91b7!5m2!4m1!1i2!8m2!3d32.0868045!4d74.2012461!16s%2Fg%2F12mkzk9qk?entry=ttu";

        public MainForm()
        {
            InitializeComponent();
        }

        private async void MainForm_Load(object sender, EventArgs e)
        {
            await webView21.EnsureCoreWebView2Async(null);
            webView21.Source = new Uri(MapUrl);
        }
    }
}
