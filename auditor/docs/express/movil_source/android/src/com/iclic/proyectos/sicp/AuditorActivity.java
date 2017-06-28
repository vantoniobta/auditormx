package com.iclic.proyectos.sicp;

import java.util.ArrayList;
import java.util.List;

import android.app.TabActivity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.graphics.Bitmap;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.provider.MediaStore;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MenuInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.ViewGroup;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.RadioGroup;
import android.widget.TabHost;
import android.widget.TabHost.OnTabChangeListener;
import android.widget.TextView;
import android.widget.Toast;

import com.iclic.proyectos.sicp.model.Foto;
import com.iclic.proyectos.sicp.model.Publicidad;

public class AuditorActivity extends TabActivity {
	List<Publicidad> model = new ArrayList<Publicidad>();
	PublicidadAdapter adapter = null;
	EditText pubId = null;
	EditText desc = null;
	RadioGroup types = null;

	LinearLayout images = null;
	protected boolean clicked;
	private LocationManager locationManager;
	
	

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		
		Publicidad.setPreferences( this.getSharedPreferences(Publicidad.PREFS_NAME, 0) );
		Publicidad.context = this;

		model = Publicidad.GetAll(this);

		pubId = (EditText) findViewById(R.id.pubid);
		desc = (EditText) findViewById(R.id.descrip);
		types = (RadioGroup) findViewById(R.id.types);
		images = (LinearLayout) findViewById(R.id.fotocontainer);

		Button save = (Button) findViewById(R.id.save);

		save.setOnClickListener(onSave);

		ListView list = (ListView) findViewById(R.id.publicidads);

		adapter = new PublicidadAdapter();
		list.setAdapter(adapter);

		getTabHost().setOnTabChangedListener(onTabChangeListener);

		TabHost.TabSpec spec = getTabHost().newTabSpec("tag1");

		spec.setContent(R.id.publicidads);
		spec.setIndicator("Lista", null);
		getTabHost().addTab(spec);

		spec = getTabHost().newTabSpec("tag2");
		spec.setContent(R.id.details);
		spec.setIndicator("Publicidad", null);
		getTabHost().addTab(spec);

		getTabHost().setCurrentTab(0);

		list.setOnItemClickListener(onListClick);

		Button phototake = (Button) findViewById(R.id.photo);
		phototake.setOnClickListener(cameraClick);

		locationManager = (LocationManager) this
				.getSystemService(Context.LOCATION_SERVICE);
		locationManager.requestLocationUpdates(
				LocationManager.NETWORK_PROVIDER, 0, 0, locationListener);
		Publicidad.lastLocation = getLastBestLocation();
	}

	LocationListener locationListener = new LocationListener() {
		public void onLocationChanged(Location location) {
			Publicidad.lastLocation = location;
			Log.i("location", location.toString());
		}

		public void onStatusChanged(String provider, int status, Bundle extras) {
		}

		public void onProviderEnabled(String provider) {
		}

		public void onProviderDisabled(String provider) {
		}
	};
	OnTabChangeListener onTabChangeListener = new OnTabChangeListener() {

		@Override
		public void onTabChanged(String arg0) {
			if ((getTabHost().getCurrentTab() == 1) && !clicked) {
				selectedPublicidad = new Publicidad();
				redrawDetailWithPublicidad(selectedPublicidad);
			}
			clicked = false;
		}
	};

	private View.OnClickListener onSave = new View.OnClickListener() {
		public void onClick(View v) {
			if (selectedPublicidad == null) {
				selectedPublicidad = new Publicidad();
			}

			selectedPublicidad.pubId = (pubId.getText().toString());
			selectedPublicidad.details = (desc.getText().toString());

			switch (types.getCheckedRadioButtonId()) {
			case R.id.bien:
				selectedPublicidad.type = ("Bien");
				break;

			case R.id.mal:
				selectedPublicidad.type = ("Mal");
				break;

			case R.id.medio:
				selectedPublicidad.type = ("Medio");
				break;

			}
			
			SharedPreferences prefs = getSharedPreferences(Publicidad.PREFS_NAME, 0);
			if (Publicidad.validId(prefs,selectedPublicidad.pubId)){
				if (selectedPublicidad.pos == -1)
					adapter.add(selectedPublicidad);
				selectedPublicidad.save(AuditorActivity.this);

				adapter.notifyDataSetChanged();

				selectedPublicidad = null;
				getTabHost().setCurrentTab(0);
			}else{
				Toast.makeText(AuditorActivity.this, "Id no valido", Toast.LENGTH_LONG).show();
			}
		}
	};

	Publicidad selectedPublicidad = null;

	private AdapterView.OnItemClickListener onListClick = new AdapterView.OnItemClickListener() {
		public void onItemClick(AdapterView<?> parent, View view, int position,
				long id) {
			selectedPublicidad = model.get(position);
			clicked = true;

			redrawDetailWithPublicidad(selectedPublicidad);

			getTabHost().setCurrentTab(1);
		}
	};

	public void redrawDetailWithPublicidad(Publicidad selectedPublicidad) {
		pubId.setText(selectedPublicidad.pubId);
		desc.setText(selectedPublicidad.details);

		if (selectedPublicidad.type.equals("Bien")) {
			types.check(R.id.bien);
		} else if (selectedPublicidad.type.equals("Mal")) {
			types.check(R.id.mal);
		} else {
			types.check(R.id.medio);
		}
		
		images.removeAllViews();
		
		for (Foto f: selectedPublicidad.fotos){
			pushFotoToDrawing(f);
		}

	}

	class PublicidadAdapter extends ArrayAdapter<Publicidad> {
		PublicidadAdapter() {
			super(AuditorActivity.this, R.layout.row, model);
		}

		public View getView(int position, View convertView, ViewGroup parent) {
			View row = convertView;
			PublicidadHolder holder = null;

			if (row == null) {
				LayoutInflater inflater = getLayoutInflater();

				row = inflater.inflate(R.layout.row, parent, false);
				holder = new PublicidadHolder(row);
				row.setTag(holder);
			} else {
				holder = (PublicidadHolder) row.getTag();
			}

			holder.populateFrom(model.get(position));

			return (row);
		}
	}

	static class PublicidadHolder {
		private TextView name = null;
		private TextView address = null;
		private ImageView icon = null;

		// private View row = null;

		PublicidadHolder(View row) {
			// this.row = row;

			name = (TextView) row.findViewById(R.id.title);
			address = (TextView) row.findViewById(R.id.desc);
			icon = (ImageView) row.findViewById(R.id.icon);
		}

		void populateFrom(Publicidad r) {
			name.setText(r.pubId);
			address.setText(r.details);

			if (r.type.equals("Mal")) {
				icon.setImageResource(R.drawable.ball_red);
			} else if (r.type.equals("Bien")) {
				icon.setImageResource(R.drawable.ball_green);
			} else {
				icon.setImageResource(R.drawable.ball_yellow);
			}

		}
	}

	OnClickListener cameraClick = new OnClickListener() {

		@Override
		public void onClick(View arg0) {
			dispatchTakePictureIntent(0);
		}

	};

	private void dispatchTakePictureIntent(int actionCode) {
		Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
		startActivityForResult(takePictureIntent, actionCode);
	}

	@Override
	protected void onActivityResult(int requestCode, int resultCode, Intent data) {
		if (data != null)// no toma foto
			handleSmallCameraPhoto(data);
	}

	Foto mImage = null;

	private void handleSmallCameraPhoto(Intent intent) {
		Bundle extras = intent.getExtras();
		Bitmap mImageBitmap = (Bitmap) extras.get("data");
		Foto f = new Foto(mImageBitmap);
		this.pushFotoToDrawing(f);
		
		this.selectedPublicidad.fotos.add(f);
		//image.setImageBitmap(mImageBitmap);
		// mVideoUri = null;
		//image.setVisibility(View.VISIBLE);
	}
	
	private void pushFotoToDrawing(Foto f){
		ImageView img = new ImageView(this);
		img.setImageBitmap(f.image);
		images.addView(img);
		img.setVisibility(View.VISIBLE);
	}

	public Location getLastBestLocation() {
		Location bestResult = null;
		float bestAccuracy = Float.MAX_VALUE;
		long bestTime = Long.MIN_VALUE;

		// Iterate through all the providers on the system, keeping
		// note of the most accurate result within the acceptable time limit.
		// If no result is found within maxTime, return the newest Location.
		List<String> matchingProviders = locationManager.getAllProviders();
		for (String provider : matchingProviders) {
			Location location = locationManager.getLastKnownLocation(provider);
			if (location != null) {
				float accuracy = location.getAccuracy();
				long time = location.getTime();

				if ((accuracy < bestAccuracy)) {
					bestResult = location;
					bestAccuracy = accuracy;
					bestTime = time;
				} else if ( bestAccuracy == Float.MAX_VALUE
						&& time > bestTime) {
					bestResult = location;
					bestTime = time;
				}
			}
		}

		return bestResult;
	}
	
	 @Override
	 public boolean onCreateOptionsMenu(Menu menu) {
	     MenuInflater inflater = getMenuInflater();
	     inflater.inflate(R.menu.proveedor, menu);
	     return true;
	 }
	 
	 @Override
	 public boolean onOptionsItemSelected(MenuItem item) {
	     // Handle item selection
	     switch (item.getItemId()) {
	         case R.id.action_upload:
	             Publicidad.uploadAll(this);
	             return true;
	         default:
	             return super.onOptionsItemSelected(item);
	     }
	 } 
}
