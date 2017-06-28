package com.iclic.proyectos.sicp;

import com.iclic.proyectos.sicp.R;

import android.app.Activity;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;

public class Full_Screen extends Activity 
{

	@Override
	public void onCreate(Bundle savedInstanceState)
	{
		super.onCreate(savedInstanceState);
		getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
		requestWindowFeature(Window.FEATURE_NO_TITLE);
		this.setContentView(R.layout.full_screen);
		ImageView img = (ImageView)findViewById(R.id.pic);
		Intent intent = getIntent();
		byte[] bitmapdata = intent.getByteArrayExtra("Img");
		Bitmap bitmap = BitmapFactory.decodeByteArray(bitmapdata , 0, bitmapdata .length);
		
		img.setImageBitmap(bitmap);
        img.setScaleType(ImageView.ScaleType.FIT_CENTER);

	}
	
}
