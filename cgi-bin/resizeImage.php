<?php
  $maxDim = 800;
  list($width, $height, $type, $attr) = getimagesize( $_FILES['myFile']['tmp_name'] );
  if ( $width > $maxDim || $height > $maxDim ) {
      $target_filename = $_FILES['myFile']['tmp_name'];
      $fn = $_FILES['myFile']['tmp_name'];
      $size = getimagesize( $fn );
      $ratio = $size[0]/$size[1]; // width/height
      if( $ratio > 1) {
          $width = $maxDim;
          $height = $maxDim/$ratio;
      } else {
          $width = $maxDim*$ratio;
          $height = $maxDim;
      }
      $src = imagecreatefromstring( file_get_contents( $fn ) );
      $dst = imagecreatetruecolor( $width, $height );
      imagecopyresampled( $dst, $src, 0, 0, 0, 0, $width, $height, $size[0], $size[1] );
      imagedestroy( $src );
      imagepng( $dst, $target_filename ); // adjust format as needed
      imagedestroy( $dst );
  }


